import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CheckCircle2, PackageSearch } from "lucide-react-native";
import { BottomSheet } from "./BottomSheet";
import { Button, TextAreaField, TextField } from "./ui";
import { SelectField } from "./SelectField";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import type { Product } from "@/types";

export function BulkOrderSheet({
  visible,
  onClose,
  products,
  defaultProductId,
}: {
  visible: boolean;
  onClose: () => void;
  products: Product[];
  defaultProductId?: string;
}) {
  const { t } = useTranslation();
  const addBulkOrderRequest = useAppStore((s) => s.addBulkOrderRequest);
  const [productId, setProductId] = useState(defaultProductId ?? products[0]?.id ?? "");
  const [quantity, setQuantity] = useState("50");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function reset() {
    setQuantity("50");
    setBudget("");
    setLocation("");
    setMessage("");
    setSent(false);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 250);
  }

  function handleSubmit() {
    if (!productId) return;
    addBulkOrderRequest({
      buyerId: "buyer_demo",
      buyerName: "Demo Buyer",
      productId,
      quantity: Number(quantity) || 0,
      budget: Number(budget) || 0,
      deliveryLocation: location,
      message,
    });
    setSent(true);
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={sent ? undefined : t("bulkOrder.title")}
      subtitle={sent ? undefined : t("bulkOrder.subtitle")}
    >
      {sent ? (
        <View style={styles.sentState}>
          <View style={styles.sentIcon}>
            <CheckCircle2 size={28} color={colors.success} />
          </View>
          <Text style={styles.sentTitle}>{t("bulkOrder.sentTitle")}</Text>
          <Text style={styles.sentBody}>{t("bulkOrder.sentBody")}</Text>
          <Button label={t("common.done")} onPress={handleClose} />
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          <SelectField
            label={t("bulkOrder.product")}
            value={productId}
            onChange={setProductId}
            placeholder={t("bulkOrder.selectProduct")}
            options={products.map((p) => ({ label: p.name, value: p.id }))}
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField label={t("bulkOrder.quantity")} keyboardType="number-pad" value={quantity} onChangeText={setQuantity} />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label={t("bulkOrder.budget")}
                keyboardType="number-pad"
                value={budget}
                onChangeText={setBudget}
                placeholder={t("bulkOrder.budgetPlaceholder")}
              />
            </View>
          </View>
          <TextField
            label={t("bulkOrder.location")}
            value={location}
            onChangeText={setLocation}
            placeholder={t("bulkOrder.locationPlaceholder")}
          />
          <TextAreaField
            label={t("bulkOrder.message")}
            value={message}
            onChangeText={setMessage}
            placeholder={t("bulkOrder.messagePlaceholder")}
          />
          <Button
            label={t("bulkOrder.send")}
            icon={<PackageSearch size={16} color={colors.primaryForeground} />}
            onPress={handleSubmit}
            fullWidth
          />
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md },
  sentState: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
  sentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.successSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sentTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  sentBody: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center" },
});

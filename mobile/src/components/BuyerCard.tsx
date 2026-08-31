import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CheckCircle2, MapPin, Sparkles } from "lucide-react-native";
import { Avatar, Badge, Button } from "./ui";
import { BottomSheet } from "./BottomSheet";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import type { Buyer } from "@/types";

const CATEGORY_KEY: Record<Buyer["category"], string> = {
  Retailer: "b2b.categoryRetailer",
  "Interior Designer": "b2b.categoryInteriorDesigner",
  Hotel: "b2b.categoryHotel",
  "Gift Shop": "b2b.categoryGiftShop",
  Wholesaler: "b2b.categoryWholesaler",
  "Corporate Buyer": "b2b.categoryCorporateBuyer",
};

export function BuyerCard({ buyer }: { buyer: Buyer }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Avatar initials={buyer.logoInitials} color={buyer.logoColor} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{buyer.companyName}</Text>
            <Text style={styles.category}>{t(CATEGORY_KEY[buyer.category])}</Text>
          </View>
        </View>
        <Badge label={`${buyer.matchScore}% ${t("b2b.match")}`} tone="success" />
      </View>

      <Text style={styles.needsLabel}>
        {t("b2b.needs")} <Text style={styles.needsValue}>{buyer.interestedIn}</Text>
      </Text>
      <View style={styles.row}>
        <Text style={styles.needsLabel}>
          {t("b2b.quantity")}{" "}
          <Text style={styles.needsValue}>
            {buyer.potentialOrderMin}–{buyer.potentialOrderMax} {t("b2b.units")}
          </Text>
        </Text>
      </View>
      <View style={styles.locationRow}>
        <MapPin size={12} color={colors.foregroundMuted} />
        <Text style={styles.location}>{buyer.location}</Text>
      </View>

      <Button label={t("b2b.viewOpportunity")} variant="outline" size="sm" onPress={() => setOpen(true)} />

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={sent ? undefined : buyer.companyName}>
        {sent ? (
          <View style={styles.sentState}>
            <View style={styles.sentIcon}>
              <CheckCircle2 size={28} color={colors.success} />
            </View>
            <Text style={styles.sentTitle}>{t("bulkOrder.sentTitle")}</Text>
            <Text style={styles.sentBody}>{t("b2b.interestSent", { company: buyer.companyName })}</Text>
            <Button label={t("common.done")} onPress={() => setOpen(false)} />
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            <Text style={styles.about}>{buyer.about}</Text>
            <View style={styles.matchBox}>
              <Sparkles size={14} color={colors.info} />
              <Text style={styles.matchText}>{buyer.matchReason}</Text>
            </View>
            <Button label={t("b2b.expressInterest")} onPress={() => setSent(true)} />
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  name: { fontSize: fontSize.sm, fontWeight: "700", color: colors.foreground },
  category: { fontSize: 11, color: colors.foregroundMuted },
  row: { flexDirection: "row" },
  needsLabel: { fontSize: 12, color: colors.foregroundMuted },
  needsValue: { color: colors.foreground, fontWeight: "600" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  location: { fontSize: 12, color: colors.foregroundMuted },
  about: { fontSize: fontSize.sm, color: colors.foregroundMuted, lineHeight: 20 },
  matchBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.infoSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  matchText: { flex: 1, fontSize: 12, color: colors.info },
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

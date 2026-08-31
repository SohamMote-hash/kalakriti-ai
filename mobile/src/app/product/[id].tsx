import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Boxes, CheckCircle2, Clock, Heart, Mail, MapPin, MessageCircle, PackageSearch, Star } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ProductImage } from "@/components/ProductImage";
import { Avatar, Badge, Button, Card, TextAreaField } from "@/components/ui";
import { BottomSheet } from "@/components/BottomSheet";
import { BulkOrderSheet } from "@/components/BulkOrderSheet";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { getArtisanById } from "@/data/seedArtisans";
import { formatCurrency } from "@/utils/format";

export default function ProductDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const products = useAppStore((s) => s.products);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const toggleSavedProduct = useAppStore((s) => s.toggleSavedProduct);
  const addEnquiry = useAppStore((s) => s.addEnquiry);

  const [enquired, setEnquired] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="" />
        <Text style={{ textAlign: "center", marginTop: spacing.xl, color: colors.foregroundMuted }}>Not found</Text>
      </SafeAreaView>
    );
  }

  const artisan = getArtisanById(product.artisanId);
  const saved = savedProductIds.includes(product.id);

  function handleEnquire() {
    addEnquiry({
      productId: product!.id,
      buyerName: "Demo Buyer",
      buyerCompany: "Marketplace Enquiry",
      message: `Interested in "${product!.name}".`,
      quantity: 1,
    });
    setEnquired(true);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("productDetails.backToMarketplace")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProductImage category={product.category} size={260} radius={radius.md} iconSize={72} fullWidth />

        <View style={styles.titleRow}>
          <Badge label={t(`categories.${product.category}`)} tone="secondary" />
          {toggleSavedProduct && (
            <Button
              label=""
              variant="outline"
              size="sm"
              icon={<Heart size={16} color={saved ? colors.danger : colors.foreground} fill={saved ? colors.danger : "transparent"} />}
              onPress={() => toggleSavedProduct(product.id)}
              style={{ width: 40, paddingHorizontal: 0 }}
            />
          )}
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Boxes size={16} color={colors.foregroundMuted} />
            <Text style={styles.infoLabel}>{t("productDetails.availableQuantity")}</Text>
            <Text style={styles.infoValue}>
              {product.availableQuantity} {t("common.units")}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Clock size={16} color={colors.foregroundMuted} />
            <Text style={styles.infoLabel}>{t("productDetails.productionTime")}</Text>
            <Text style={styles.infoValue}>
              {product.productionTimeDays} {t("common.days")}
            </Text>
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={styles.fieldLabel}>{t("productDetails.materials")}</Text>
          <Text style={styles.fieldValue}>{product.material}</Text>
        </View>
        <View style={{ gap: 4 }}>
          <Text style={styles.fieldLabel}>{t("productDetails.craftTechnique")}</Text>
          <Text style={styles.fieldValue}>{product.craftTechnique}</Text>
        </View>

        <View style={styles.tagsRow}>
          {product.tags.map((tag) => (
            <Badge key={tag} label={`#${tag}`} tone="neutral" />
          ))}
        </View>

        {artisan && (
          <Card style={styles.artisanRow}>
            <Avatar initials={artisan.initials} color={artisan.avatarColor} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.artisanName}>{artisan.name}</Text>
              <View style={styles.row}>
                <MapPin size={11} color={colors.foregroundMuted} />
                <Text style={styles.artisanMeta}>
                  {artisan.location}, {artisan.state} · <Star size={11} color={colors.accent} /> {artisan.rating}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {artisan && (
          <Card>
            <Text style={styles.aboutTitle}>{t("productDetails.aboutArtisan")}</Text>
            <Text style={styles.description}>{artisan.bio}</Text>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statValue}>{artisan.yearsOfExperience}</Text>
                <Text style={styles.statLabel}>{t("productDetails.yearsOfExperience")}</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{artisan.totalProducts}</Text>
                <Text style={styles.statLabel}>{t("productDetails.productsListed")}</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{artisan.rating}★</Text>
                <Text style={styles.statLabel}>{t("productDetails.buyerRating")}</Text>
              </View>
            </View>
          </Card>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        <Button
          label={enquired ? t("productDetails.enquireSent") : t("productDetails.enquire")}
          variant={enquired ? "soft" : "primary"}
          icon={<MessageCircle size={16} color={enquired ? colors.primaryHover : colors.primaryForeground} />}
          onPress={handleEnquire}
          disabled={enquired}
          style={{ flex: 1 }}
        />
        <Button
          label={t("productDetails.bulkOrder")}
          variant="secondary"
          icon={<PackageSearch size={16} color={colors.secondaryForeground} />}
          onPress={() => setBulkOpen(true)}
          style={{ flex: 1 }}
        />
        <Button
          label=""
          variant="outline"
          icon={<Mail size={18} color={colors.foreground} />}
          onPress={() => setContactOpen(true)}
          style={{ width: 48, paddingHorizontal: 0 }}
        />
      </View>

      <BulkOrderSheet visible={bulkOpen} onClose={() => setBulkOpen(false)} products={[product]} defaultProductId={product.id} />

      <BottomSheet
        visible={contactOpen}
        onClose={() => {
          setContactOpen(false);
          setTimeout(() => setContactSent(false), 200);
        }}
        title={contactSent ? undefined : t("productDetails.contactArtisan")}
      >
        {contactSent ? (
          <View style={styles.sentState}>
            <View style={styles.sentIcon}>
              <CheckCircle2 size={28} color={colors.success} />
            </View>
            <Text style={styles.aboutTitle}>{t("productDetails.messageSentTitle")}</Text>
            <Text style={styles.description}>{t("productDetails.messageSentBody", { name: artisan?.name })}</Text>
            <Button label={t("common.done")} onPress={() => setContactOpen(false)} />
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            <TextAreaField
              value={contactMessage}
              onChangeText={setContactMessage}
              placeholder={t("productDetails.messagePlaceholder")}
            />
            <Button label={t("productDetails.sendMessage")} onPress={() => setContactSent(true)} fullWidth />
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
  name: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  price: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.primary },
  description: { fontSize: fontSize.sm, color: colors.foregroundMuted, lineHeight: 21 },
  infoRow: { flexDirection: "row", gap: spacing.sm },
  infoBox: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, gap: 2 },
  infoLabel: { fontSize: 11, color: colors.foregroundMuted, marginTop: 4 },
  infoValue: { fontSize: fontSize.sm, fontWeight: "700", color: colors.foreground },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: colors.foregroundMuted, textTransform: "uppercase" },
  fieldValue: { fontSize: fontSize.sm, color: colors.foreground },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  artisanRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  artisanName: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  artisanMeta: { fontSize: 12, color: colors.foregroundMuted },
  aboutTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground, marginBottom: 6, textAlign: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: spacing.md },
  statValue: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  statLabel: { fontSize: 11, color: colors.foregroundMuted, textAlign: "center" },
  actionBar: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sentState: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
  sentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.successSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, PackageSearch, Sparkles } from "lucide-react-native";
import { Button, Card } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { BulkOrderSheet } from "@/components/BulkOrderSheet";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";

export default function BuyerHomeScreen() {
  const { t } = useTranslation();
  const products = useAppStore((s) => s.products);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const toggleSavedProduct = useAppStore((s) => s.toggleSavedProduct);
  const [bulkOpen, setBulkOpen] = useState(false);

  const published = useMemo(() => products.filter((p) => p.status === "published"), [products]);
  const recommended = useMemo(() => [...published].sort((a, b) => b.views - a.views).slice(0, 6), [published]);
  const savedProducts = published.filter((p) => savedProductIds.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{t("buyerHome.greeting")}</Text>
        <Text style={styles.subtitle}>{t("buyerHome.subtitle")}</Text>

        <Button
          label={t("buyerHome.requestBulkOrder")}
          icon={<PackageSearch size={16} color={colors.primaryForeground} />}
          onPress={() => setBulkOpen(true)}
          style={{ marginTop: spacing.lg }}
          fullWidth
        />

        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.header}>
            <Sparkles size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>{t("buyerHome.recommendedTitle")}</Text>
          </View>
          <View style={styles.grid}>
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} saved={savedProductIds.includes(p.id)} onToggleSave={toggleSavedProduct} />
            ))}
          </View>
        </View>

        <View style={{ marginTop: spacing.xl, marginBottom: spacing.xxxl }}>
          <View style={styles.header}>
            <Heart size={18} color={colors.danger} />
            <Text style={styles.sectionTitle}>
              {t("buyerHome.savedTitle")} ({savedProducts.length})
            </Text>
          </View>
          {savedProducts.length === 0 ? (
            <Card style={{ marginTop: spacing.sm }}>
              <Text style={styles.emptyText}>{t("buyerHome.savedEmpty")}</Text>
            </Card>
          ) : (
            <View style={styles.grid}>
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} saved onToggleSave={toggleSavedProduct} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BulkOrderSheet visible={bulkOpen} onClose={() => setBulkOpen(false)} products={published} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  greeting: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  emptyText: { color: colors.foregroundMuted, fontSize: fontSize.sm, textAlign: "center" },
});

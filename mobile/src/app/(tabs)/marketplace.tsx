import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { TextField } from "@/components/ui";
import { CategoryChips } from "@/components/CategoryChips";
import { ProductCard } from "@/components/ProductCard";
import { SelectField } from "@/components/SelectField";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { MARKETPLACE_CATEGORIES } from "@/constants/categories";

type SortOption = "popular" | "newest" | "price-low" | "price-high";

export default function MarketplaceTab() {
  const { t } = useTranslation();
  const products = useAppStore((s) => s.products);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const toggleSavedProduct = useAppStore((s) => s.toggleSavedProduct);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("popular");

  const published = useMemo(() => products.filter((p) => p.status === "published"), [products]);

  const categoryOptions = [
    { label: t("common.all"), value: "All" },
    ...MARKETPLACE_CATEGORIES.map((c) => ({ label: t(`categories.${c}`), value: c })),
  ];

  const sortOptions = [
    { label: t("marketplace.sortPopular"), value: "popular" },
    { label: t("marketplace.sortNewest"), value: "newest" },
    { label: t("marketplace.sortPriceLow"), value: "price-low" },
    { label: t("marketplace.sortPriceHigh"), value: "price-high" },
  ];

  const filtered = useMemo(() => {
    let result = published;
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted.sort((a, b) => b.views - a.views);
    }
    return sorted;
  }, [published, category, search, sort]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("marketplace.title")}</Text>
        <Text style={styles.subtitle}>{t("marketplace.subtitle", { count: published.length })}</Text>

        <View style={{ position: "relative", marginTop: spacing.md }}>
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t("marketplace.searchPlaceholder")}
            style={{ paddingLeft: 40 }}
          />
          <Search size={18} color={colors.foregroundMuted} style={styles.searchIcon} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <SelectField value={sort} onChange={(v) => setSort(v as SortOption)} options={sortOptions} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <CategoryChips options={categoryOptions} value={category} onChange={setCategory} />
        </View>
      </View>

      <FlatList
        data={filtered}
        key="marketplace-grid"
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.sm }}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} saved={savedProductIds.includes(item.id)} onToggleSave={toggleSavedProduct} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <SlidersHorizontal size={28} color={colors.foregroundMuted} />
            <Text style={styles.emptyTitle}>{t("marketplace.noProductsTitle")}</Text>
            <Text style={styles.emptyBody}>{t("marketplace.noProductsSubtitle")}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  searchIcon: { position: "absolute", left: 12, top: 15 },
  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl, gap: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl, gap: 6 },
  emptyTitle: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  emptyBody: { fontSize: fontSize.sm, color: colors.foregroundMuted },
});

import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Store } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button, EmptyState } from "@/components/ui";
import { CategoryChips } from "@/components/CategoryChips";
import { ProductCard } from "@/components/ProductCard";
import { colors, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";

export default function MyProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const products = useAppStore((s) => s.products);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const myProducts = useMemo(() => products.filter((p) => p.artisanId === currentArtisan.id), [products]);
  const filtered = myProducts.filter((p) => filter === "all" || p.status === filter);

  const tabs = [
    { label: `${t("profile.myProducts")} (${myProducts.length})`, value: "all" },
    { label: `${t("profile.published")} (${myProducts.filter((p) => p.status === "published").length})`, value: "published" },
    { label: `${t("profile.draft")} (${myProducts.filter((p) => p.status === "draft").length})`, value: "draft" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("profile.myProducts")} />
      <View style={styles.chipsWrap}>
        <CategoryChips options={tabs} value={filter} onChange={(v) => setFilter(v as typeof filter)} />
      </View>
      <FlatList
        data={filtered}
        key="my-products-grid"
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.sm }}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <EmptyState
            icon={
              <View style={styles.emptyIcon}>
                <Store size={24} color={colors.primary} />
              </View>
            }
            title={t("productStudio.step1Title")}
            body={t("home.actionAddProduct")}
            action={<Button label={t("home.actionAddProduct")} icon={<Plus size={16} color={colors.primaryForeground} />} onPress={() => router.push("/product-studio")} />}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  chipsWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  grid: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});

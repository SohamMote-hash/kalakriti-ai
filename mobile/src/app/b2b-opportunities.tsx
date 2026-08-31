import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { BuyerCard } from "@/components/BuyerCard";
import { CategoryChips } from "@/components/CategoryChips";
import { colors, radius, spacing } from "@/constants/theme";
import { seedBuyers } from "@/data/seedBuyers";
import type { BuyerCategory } from "@/types";

const CATEGORIES: BuyerCategory[] = ["Retailer", "Interior Designer", "Hotel", "Gift Shop", "Wholesaler", "Corporate Buyer"];
const CATEGORY_KEY: Record<BuyerCategory, string> = {
  Retailer: "b2b.categoryRetailer",
  "Interior Designer": "b2b.categoryInteriorDesigner",
  Hotel: "b2b.categoryHotel",
  "Gift Shop": "b2b.categoryGiftShop",
  Wholesaler: "b2b.categoryWholesaler",
  "Corporate Buyer": "b2b.categoryCorporateBuyer",
};

export default function B2BOpportunitiesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"All" | BuyerCategory>("All");

  const options = [{ label: t("common.all"), value: "All" }, ...CATEGORIES.map((c) => ({ label: t(CATEGORY_KEY[c]), value: c }))];

  const buyers = useMemo(() => {
    const list = filter === "All" ? seedBuyers : seedBuyers.filter((b) => b.category === filter);
    return [...list].sort((a, b) => b.matchScore - a.matchScore);
  }, [filter]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("b2b.title")} subtitle={t("b2b.subtitle")} />
      <View style={styles.disclaimerWrap}>
        <View style={styles.disclaimer}>
          <Sparkles size={14} color={colors.info} />
          <Text style={styles.disclaimerText}>{t("b2b.disclaimer")}</Text>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <CategoryChips options={options} value={filter} onChange={(v) => setFilter(v as typeof filter)} />
        </View>
      </View>
      <FlatList
        data={buyers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <BuyerCard buyer={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  disclaimerWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  disclaimer: { flexDirection: "row", gap: 8, backgroundColor: colors.infoSoft, padding: spacing.sm, borderRadius: radius.sm },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.info },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
});

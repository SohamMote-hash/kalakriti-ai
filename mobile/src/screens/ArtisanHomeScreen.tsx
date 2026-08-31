import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, Eye, FileText, MessageSquare, Package, Plus, Wallet } from "lucide-react-native";
import { AIBadge, Card } from "@/components/ui";
import { StatGrid, type StatItem } from "@/components/StatGrid";
import { QuickActions, type QuickAction } from "@/components/QuickActions";
import { AIInsightCard } from "@/components/AIInsightCard";
import { ProductCard } from "@/components/ProductCard";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";
import { formatCompactNumber, formatCurrency } from "@/utils/format";
import { generateDashboardInsights } from "@/services/ai";
import { mockGenerateDashboardInsights } from "@/services/mockAi";
import type { AIMarketInsight } from "@/types";

export default function ArtisanHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const products = useAppStore((s) => s.products);
  const enquiries = useAppStore((s) => s.enquiries);

  const myProducts = useMemo(() => products.filter((p) => p.artisanId === currentArtisan.id), [products]);
  const myEnquiries = useMemo(
    () => enquiries.filter((e) => myProducts.some((p) => p.id === e.productId)),
    [enquiries, myProducts],
  );

  const totalViews = myProducts.reduce((s, p) => s + p.views, 0);
  const estimatedRevenue = myProducts.reduce((s, p) => s + p.price * Math.max(2, Math.round(p.enquiries * 1.6)), 0);
  const estimatedProfit = Math.round(estimatedRevenue * 0.4);

  const [insights, setInsights] = useState<AIMarketInsight[]>(() => mockGenerateDashboardInsights(myProducts));

  useEffect(() => {
    let cancelled = false;
    generateDashboardInsights(myProducts).then((res) => {
      if (!cancelled) setInsights(res.insights);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProducts.length]);

  const stats: StatItem[] = [
    { label: t("home.statProducts"), value: String(myProducts.length), icon: Package, tone: "primary" },
    { label: t("home.statViews"), value: formatCompactNumber(totalViews), icon: Eye, tone: "info" },
    { label: t("home.statEnquiries"), value: String(myEnquiries.length), icon: MessageSquare, tone: "secondary" },
    { label: t("home.statProfit"), value: formatCurrency(estimatedProfit), icon: Wallet, tone: "accent" },
  ];

  const actions: QuickAction[] = [
    { label: t("home.actionAddProduct"), href: "/product-studio", icon: Plus, color: colors.primary },
    { label: t("home.actionMarketAnalysis"), href: "/market-analysis", icon: BarChart3, color: colors.secondary },
    { label: t("home.actionFinancialPlanner"), href: "/financial-planner", icon: Wallet, color: colors.info },
    { label: t("home.actionBusinessPlan"), href: "/business-plan", icon: FileText, color: colors.accent },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{t("home.greeting", { name: currentArtisan.name.split(" ")[0] })}</Text>
        <Text style={styles.subtitle}>{t("home.subtitle")}</Text>

        <StatGrid items={stats} style={{ marginTop: spacing.lg }} />

        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.insightsHeader}>
            <Text style={styles.sectionTitle}>{t("home.aiInsightsTitle")}</Text>
            <AIBadge label={t("common.aiGenerated")} />
          </View>
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {insights.slice(0, 3).map((insight, i) => (
              <AIInsightCard key={i} insight={insight} />
            ))}
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.sectionTitle}>{t("home.quickActionsTitle")}</Text>
          <View style={{ marginTop: spacing.sm }}>
            <QuickActions actions={actions} />
          </View>
        </View>

        <View style={{ marginTop: spacing.xl, marginBottom: spacing.xxxl }}>
          <View style={styles.insightsHeader}>
            <Text style={styles.sectionTitle}>{t("home.recentProductsTitle")}</Text>
            <Text style={styles.seeAll} onPress={() => router.push("/my-products")}>
              {t("home.seeAll")}
            </Text>
          </View>
          {myProducts.length === 0 ? (
            <Card style={{ marginTop: spacing.sm }}>
              <Text style={{ color: colors.foregroundMuted, textAlign: "center" }}>—</Text>
            </Card>
          ) : (
            <View style={styles.grid}>
              {myProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} width={undefined} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  greeting: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  insightsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  seeAll: { fontSize: fontSize.sm, color: colors.primary, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
});

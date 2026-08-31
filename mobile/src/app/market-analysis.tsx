import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle, CheckCircle2, Database, Flame, Info, Layers, Target, TrendingUp, type LucideIcon } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AIBadge, Card } from "@/components/ui";
import { SelectField } from "@/components/SelectField";
import { ProductImage } from "@/components/ProductImage";
import { SimpleBarChart } from "@/components/charts";
import { colors, fontSize, radius, spacing, statusColors } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";
import { runMarketAnalysis } from "@/services/marketAnalysis";
import { suggestPriceRange } from "@/services/pricing";
import { formatCurrency } from "@/utils/format";

const COMPETITION_ICON = { Low: CheckCircle2, Medium: AlertTriangle, High: Flame };
const COMPETITION_COLOR = { Low: statusColors.good, Medium: statusColors.warning, High: statusColors.serious };
const COMPETITION_KEY = { Low: "marketAnalysis.competitionLow", Medium: "marketAnalysis.competitionMedium", High: "marketAnalysis.competitionHigh" };

export default function MarketAnalysisScreen() {
  const { t } = useTranslation();
  const products = useAppStore((s) => s.products);

  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id && p.status === "published"),
    [products],
  );
  const [selectedId, setSelectedId] = useState(myProducts[0]?.id ?? "");
  const selected = myProducts.find((p) => p.id === selectedId) ?? myProducts[0];

  const analysis = useMemo(() => (selected ? runMarketAnalysis(selected, products) : null), [selected, products]);
  const pricing = useMemo(
    () => (selected && analysis ? suggestPriceRange(selected.price, analysis.averagePrice, analysis.suggestedMin, analysis.suggestedMax) : null),
    [selected, analysis],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("marketAnalysis.title")} subtitle={t("marketAnalysis.subtitle")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.disclaimer}>
          <Database size={14} color={colors.info} />
          <Text style={styles.disclaimerText}>{t("marketAnalysis.disclaimer")}</Text>
        </View>

        {myProducts.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>{t("marketAnalysis.noProducts")}</Text>
          </Card>
        ) : (
          selected &&
          analysis &&
          pricing && (
            <>
              <SelectField
                label={t("marketAnalysis.selectProduct")}
                value={selected.id}
                onChange={setSelectedId}
                options={myProducts.map((p) => ({ label: p.name, value: p.id }))}
              />

              <Card style={styles.productRow}>
                <ProductImage category={selected.category} size={56} radius={radius.sm} iconSize={22} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{selected.name}</Text>
                  <Text style={styles.productMeta}>
                    {t(`categories.${selected.category}`)} · {formatCurrency(selected.price)}
                  </Text>
                </View>
              </Card>

              <View style={styles.statGrid}>
                <StatBox icon={Layers} label={t("marketAnalysis.statSimilarProducts")} value={String(analysis.similarProductCount)} tone="info" />
                <StatBox icon={TrendingUp} label={t("marketAnalysis.statPriceRange")} value={`${formatCurrency(analysis.minPrice)} – ${formatCurrency(analysis.maxPrice)}`} tone="secondary" />
                <StatBox icon={Layers} label={t("marketAnalysis.statAverage")} value={formatCurrency(analysis.averagePrice)} tone="accent" />
                <StatBox icon={Target} label={t("marketAnalysis.statSuggested")} value={`${formatCurrency(analysis.suggestedMin)} – ${formatCurrency(analysis.suggestedMax)}`} tone="primary" />
              </View>

              <SimpleBarChart
                title={t("marketAnalysis.priceDistribution")}
                labels={analysis.priceHistogram.map((h) => h.bucket.replace("₹", ""))}
                values={analysis.priceHistogram.map((h) => h.count)}
                color="#2a78d6"
              />

              <SimpleBarChart
                title={t("marketAnalysis.categoryComparison")}
                labels={analysis.categoryComparison.map((c) => t(`categories.${c.category}`).slice(0, 6))}
                values={analysis.categoryComparison.map((c) => c.averagePrice)}
                color="#eb6834"
              />

              <Card>
                <View style={styles.competitionHeader}>
                  <Text style={styles.cardTitle}>{t("marketAnalysis.statCompetition")}</Text>
                </View>
                <View style={styles.competitionRow}>
                  {(() => {
                    const Icon = COMPETITION_ICON[analysis.competitionLevel];
                    return (
                      <View style={[styles.competitionIcon, { backgroundColor: `${COMPETITION_COLOR[analysis.competitionLevel]}22` }]}>
                        <Icon size={20} color={COMPETITION_COLOR[analysis.competitionLevel]} />
                      </View>
                    );
                  })()}
                  <Text style={styles.competitionValue}>{t(COMPETITION_KEY[analysis.competitionLevel])}</Text>
                </View>
              </Card>

              <Card style={styles.insightCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{t("marketAnalysis.aiInsightTitle")}</Text>
                  <AIBadge label={t("common.aiGenerated")} />
                </View>
                <Text style={styles.insightText}>{pricing.reasoning}</Text>
                <View style={styles.footerNote}>
                  <Info size={12} color={colors.foregroundMuted} />
                  <Text style={styles.footerNoteText}>{t("marketAnalysis.disclaimerShort")}</Text>
                </View>
              </Card>
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "primary" | "secondary" | "accent" | "info";
}) {
  const bg = { primary: colors.primarySoft, secondary: colors.secondarySoft, accent: colors.accentSoft, info: colors.infoSoft }[tone];
  const fg = { primary: colors.primary, secondary: colors.secondary, accent: "#7a5c1a", info: colors.info }[tone];
  return (
    <View style={styles.statBox}>
      <View style={[styles.statIconWrap, { backgroundColor: bg }]}>
        <Icon size={16} color={fg} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  disclaimer: { flexDirection: "row", gap: 8, backgroundColor: colors.infoSoft, padding: spacing.sm, borderRadius: radius.sm, alignItems: "center" },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.info },
  emptyText: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center" },
  productRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  productName: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  productMeta: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statBox: { flexBasis: "47%", flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
  statIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  statValue: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  statLabel: { fontSize: 11, color: colors.foregroundMuted, marginTop: 2 },
  cardTitle: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  competitionHeader: { marginBottom: spacing.sm },
  competitionRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  competitionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  competitionValue: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  insightCard: { backgroundColor: colors.primarySoft, borderColor: "transparent" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  insightText: { fontSize: fontSize.sm, color: colors.foreground, lineHeight: 21, marginTop: spacing.sm },
  footerNote: { flexDirection: "row", gap: 6, marginTop: spacing.md, alignItems: "flex-start" },
  footerNoteText: { flex: 1, fontSize: 11, color: colors.foregroundMuted },
});

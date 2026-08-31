import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, ChevronDown, ChevronUp, FileText, RefreshCw, Sparkles } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AIBadge, Button, Card } from "@/components/ui";
import { SelectField } from "@/components/SelectField";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";
import { runMarketAnalysis } from "@/services/marketAnalysis";
import { calculateFinancials, defaultFinancialInputs } from "@/services/financial";
import { estimateBasePrice } from "@/services/pricing";
import { generateBusinessPlan } from "@/services/ai";
import type { AIBusinessPlan } from "@/types";

const SECTION_KEYS = [
  "sectionOverview",
  "sectionProduct",
  "sectionCustomers",
  "sectionOpportunity",
  "sectionPricing",
  "sectionCost",
  "sectionRevenue",
  "sectionGrowth",
  "sectionRisks",
];

export default function BusinessPlanScreen() {
  const { t } = useTranslation();
  const products = useAppStore((s) => s.products);

  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id && p.status === "published"),
    [products],
  );
  const [selectedId, setSelectedId] = useState(myProducts[0]?.id ?? "");
  const selected = myProducts.find((p) => p.id === selectedId) ?? myProducts[0];

  const [plan, setPlan] = useState<AIBusinessPlan | null>(null);
  const [source, setSource] = useState<"ai" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  async function handleGenerate() {
    if (!selected) return;
    setLoading(true);
    try {
      const financialInputs = { ...defaultFinancialInputs, sellingPrice: selected.price || estimateBasePrice(selected.category, selected.material) };
      const financialResults = calculateFinancials(financialInputs);
      const marketAnalysis = runMarketAnalysis(selected, products);
      const result = await generateBusinessPlan({ product: selected, artisan: currentArtisan, financialInputs, financialResults, marketAnalysis });
      setPlan(result.plan);
      setSource(result.source);
      setExpanded(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("businessPlan.title")} subtitle={t("businessPlan.subtitle")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {myProducts.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>{t("businessPlan.noProducts")}</Text>
          </Card>
        ) : (
          <>
            <SelectField
              label={t("bulkOrder.product")}
              value={selected?.id ?? ""}
              onChange={setSelectedId}
              options={myProducts.map((p) => ({ label: p.name, value: p.id }))}
            />

            <Card>
              <Text style={styles.cardTitle}>{t("businessPlan.usingDataTitle")}</Text>
              <View style={{ gap: 6, marginTop: spacing.sm }}>
                {[t("businessPlan.dataProduct"), t("businessPlan.dataFinancial"), t("businessPlan.dataMarket"), t("businessPlan.dataPricing")].map(
                  (label) => (
                    <View key={label} style={styles.dataRow}>
                      <CheckCircle2 size={14} color={colors.success} />
                      <Text style={styles.dataLabel}>{label}</Text>
                    </View>
                  ),
                )}
              </View>
            </Card>

            <Button
              label={plan ? t("businessPlan.regenerate") : t("businessPlan.generate")}
              icon={loading ? undefined : <Sparkles size={16} color={colors.primaryForeground} />}
              loading={loading}
              size="lg"
              onPress={handleGenerate}
            />

            {loading && (
              <Card style={styles.loadingCard}>
                <FileText size={28} color={colors.primary} />
                <Text style={styles.loadingText}>{t("businessPlan.generating")}</Text>
                <ActivityIndicator color={colors.primary} />
              </Card>
            )}

            {!loading && plan && (
              <View style={{ gap: spacing.sm }}>
                <View style={styles.rowBetween}>
                  <AIBadge label={source === "ai" ? t("businessPlan.aiGenerated") : t("businessPlan.aiGeneratedMock")} />
                  <Button label={t("businessPlan.regenerate")} variant="outline" size="sm" icon={<RefreshCw size={14} color={colors.foreground} />} onPress={handleGenerate} />
                </View>

                {plan.sections.map((section, i) => {
                  const isOpen = expanded === i;
                  return (
                    <Card key={section.title} style={{ padding: 0, overflow: "hidden" }}>
                      <Pressable style={styles.accordionHeaderContent} onPress={() => setExpanded(isOpen ? null : i)}>
                        <Text style={styles.accordionTitle}>
                          {i + 1}. {t(`businessPlan.${SECTION_KEYS[i]}`, section.title)}
                        </Text>
                        {isOpen ? <ChevronUp size={18} color={colors.foregroundMuted} /> : <ChevronDown size={18} color={colors.foregroundMuted} />}
                      </Pressable>
                      {isOpen && (
                        <View style={styles.accordionBody}>
                          <Text style={styles.accordionText}>{section.content}</Text>
                        </View>
                      )}
                    </Card>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  emptyText: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center" },
  cardTitle: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  dataRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dataLabel: { fontSize: fontSize.sm, color: colors.foregroundMuted },
  loadingCard: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xl },
  loadingText: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center" },
  rowBetween: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  accordionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  accordionTitle: { fontSize: fontSize.sm, fontWeight: "700", color: colors.foreground, flex: 1, paddingRight: spacing.sm },
  accordionBody: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  accordionText: { fontSize: fontSize.sm, color: colors.foregroundMuted, lineHeight: 21 },
});

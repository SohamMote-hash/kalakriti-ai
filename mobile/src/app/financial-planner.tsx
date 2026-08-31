import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card, TextField } from "@/components/ui";
import { SimpleBarChart, SimplePieChart } from "@/components/charts";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { calculateFinancials, costBreakdown, defaultFinancialInputs } from "@/services/financial";
import { formatCurrency } from "@/utils/format";
import type { FinancialInputs } from "@/types";

const COST_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];

export default function FinancialPlannerScreen() {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<FinancialInputs>(defaultFinancialInputs);

  const results = useMemo(() => calculateFinancials(inputs), [inputs]);
  const breakdown = useMemo(() => costBreakdown(inputs), [inputs]);

  function setField(key: keyof FinancialInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  }

  const fields: { key: keyof FinancialInputs; label: string }[] = [
    { key: "materialCost", label: t("financialPlanner.fieldMaterialCost") },
    { key: "labourCost", label: t("financialPlanner.fieldLabourCost") },
    { key: "packagingCost", label: t("financialPlanner.fieldPackagingCost") },
    { key: "transportCost", label: t("financialPlanner.fieldTransportCost") },
    { key: "otherCost", label: t("financialPlanner.fieldOtherCost") },
  ];

  const costLabels = [
    t("financialPlanner.material"),
    t("financialPlanner.labour"),
    t("financialPlanner.packaging"),
    t("financialPlanner.transport"),
    t("financialPlanner.other"),
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={t("financialPlanner.title")} subtitle={t("financialPlanner.subtitle")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.cardTitle}>{t("financialPlanner.inputsTitle")}</Text>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {fields.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                keyboardType="number-pad"
                value={String(inputs[f.key])}
                onChangeText={(v) => setField(f.key, Number(v) || 0)}
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>{t("financialPlanner.resultsTitle")}</Text>
          <View style={styles.resultsGrid}>
            <ResultItem label={t("financialPlanner.itemCostPerUnit")} value={formatCurrency(results.costPerUnit)} />
            <ResultItem label={t("financialPlanner.itemProfitPerUnit")} value={formatCurrency(results.profitPerUnit)} tone={results.profitPerUnit >= 0 ? "success" : "danger"} />
            <ResultItem label={t("financialPlanner.itemProfitMargin")} value={`${results.profitMarginPercent.toFixed(1)}%`} tone={results.profitMarginPercent >= 0 ? "success" : "danger"} />
            <ResultItem
              label={t("financialPlanner.itemBreakEven")}
              value={Number.isFinite(results.breakEvenUnits) ? t("financialPlanner.breakEvenUnits", { count: results.breakEvenUnits }) : t("financialPlanner.breakEvenNotReachable")}
            />
          </View>
          <View style={styles.monthlyBox}>
            <Text style={styles.monthlyLabel}>{t("financialPlanner.itemMonthlyProfit")}</Text>
            <Text style={[styles.monthlyValue, { color: results.estimatedProfit >= 0 ? colors.success : colors.danger }]}>
              {formatCurrency(results.estimatedProfit)}
            </Text>
          </View>
        </Card>

        <SimplePieChart
          title={t("financialPlanner.costBreakdownTitle")}
          data={breakdown.map((b, i) => ({ name: costLabels[i] ?? b.name, value: b.value, color: COST_COLORS[i % COST_COLORS.length] }))}
        />

        <Card>
          <Text style={styles.cardTitle}>{t("financialPlanner.whatIfTitle")}</Text>
          <Text style={styles.whatIfSubtitle}>{t("financialPlanner.whatIfSubtitle")}</Text>

          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>{t("financialPlanner.fieldSellingPrice")}</Text>
              <Text style={styles.sliderValue}>{formatCurrency(inputs.sellingPrice)}</Text>
            </View>
            <Slider
              minimumValue={50}
              maximumValue={3000}
              step={10}
              value={inputs.sellingPrice}
              onValueChange={(v) => setField("sellingPrice", v)}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceMuted}
              thumbTintColor={colors.primary}
            />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>{t("financialPlanner.fieldProductionQuantity")}</Text>
              <Text style={styles.sliderValue}>
                {inputs.productionQuantity} {t("common.units")}
              </Text>
            </View>
            <Slider
              minimumValue={5}
              maximumValue={500}
              step={5}
              value={inputs.productionQuantity}
              onValueChange={(v) => setField("productionQuantity", v)}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceMuted}
              thumbTintColor={colors.primary}
            />
          </View>
        </Card>

        <SimpleBarChart
          title={t("financialPlanner.revenueVsCostTitle")}
          labels={[t("financialPlanner.itemTotalRevenue"), t("financialPlanner.itemTotalCost")]}
          values={[results.totalRevenue, results.totalMonthlyCost]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultItem({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  return (
    <View style={styles.resultItem}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, tone === "success" && { color: colors.success }, tone === "danger" && { color: colors.danger }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  cardTitle: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  resultsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md },
  resultItem: { flexBasis: "45%", flexGrow: 1 },
  resultLabel: { fontSize: 11, color: colors.foregroundMuted, textTransform: "uppercase" },
  resultValue: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground, marginTop: 2 },
  monthlyBox: { marginTop: spacing.lg, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, padding: spacing.md, alignItems: "center" },
  monthlyLabel: { fontSize: 11, color: colors.foregroundMuted, textTransform: "uppercase" },
  monthlyValue: { fontSize: fontSize.xxl, fontWeight: "700", marginTop: 4 },
  whatIfSubtitle: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },
  sliderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  sliderLabel: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground },
  sliderValue: { fontSize: fontSize.sm, fontWeight: "700", color: colors.primary },
});

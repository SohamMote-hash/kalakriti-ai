import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - spacing.lg * 2 - spacing.lg * 2;

const baseChartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(191, 91, 48, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 96, 85, ${opacity})`,
  barPercentage: 0.6,
  propsForBackgroundLines: { stroke: colors.border },
};

export function SimpleBarChart({
  title,
  labels,
  values,
  color = colors.primary,
}: {
  title: string;
  labels: string[];
  values: number[];
  color?: string;
}) {
  if (values.length === 0) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={{ labels, datasets: [{ data: values }] }}
        width={chartWidth}
        height={190}
        fromZero
        withInnerLines
        showValuesOnTopOfBars
        chartConfig={{
          ...baseChartConfig,
          color: () => color,
        }}
        style={{ borderRadius: radius.sm, marginLeft: -spacing.lg }}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
}

export function SimplePieChart({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number; color: string }[];
}) {
  if (data.length === 0) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={data.map((d) => ({
          name: d.name,
          population: d.value,
          color: d.color,
          legendFontColor: colors.foregroundMuted,
          legendFontSize: 12,
        }))}
        width={chartWidth}
        height={180}
        chartConfig={baseChartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground, marginBottom: spacing.sm },
});

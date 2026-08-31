import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import type { AIMarketInsight } from "@/types";

const TONE = {
  positive: { icon: TrendingUp, bg: colors.successSoft, fg: colors.success },
  warning: { icon: AlertTriangle, bg: colors.warningSoft, fg: colors.warning },
  neutral: { icon: Lightbulb, bg: colors.infoSoft, fg: colors.info },
};

export function AIInsightCard({ insight }: { insight: AIMarketInsight }) {
  const tone = TONE[insight.tone];
  const Icon = tone.icon;
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: tone.bg }]}>
        <Icon size={16} color={tone.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.headline}>{insight.headline}</Text>
        <Text style={styles.detail}>{insight.detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconWrap: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  headline: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground },
  detail: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2, lineHeight: 17 },
});

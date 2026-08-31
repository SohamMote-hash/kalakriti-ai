import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "primary" | "secondary" | "accent" | "info";
}

const TONE_BG: Record<StatItem["tone"], string> = {
  primary: colors.primarySoft,
  secondary: colors.secondarySoft,
  accent: colors.accentSoft,
  info: colors.infoSoft,
};
const TONE_FG: Record<StatItem["tone"], string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  accent: "#7a5c1a",
  info: colors.info,
};

export function StatGrid({ items, style }: { items: StatItem[]; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.grid, style]}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <View key={item.label} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: TONE_BG[item.tone] }]}>
              <Icon size={18} color={TONE_FG[item.tone]} />
            </View>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label} numberOfLines={3}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  value: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  label: { fontSize: 11, color: colors.foregroundMuted, marginTop: 2 },
});

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

export interface QuickAction {
  label: string;
  href: Href;
  icon: LucideIcon;
  color: string;
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Pressable key={action.label} style={styles.item} onPress={() => router.push(action.href)}>
            <View style={[styles.iconWrap, { backgroundColor: action.color }]}>
              <Icon size={18} color={colors.white} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  item: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  label: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground, flexShrink: 1 },
});

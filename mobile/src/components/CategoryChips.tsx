import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

export function CategoryChips({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground },
  chipTextActive: { color: colors.primaryForeground },
});

import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Check, Sparkles } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

export function ProcessingChecklist({
  title,
  subtitle,
  steps,
  onDone,
}: {
  title: string;
  subtitle: string;
  steps: string[];
  onDone: () => void;
}) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= steps.length) {
      const t = setTimeout(onDone, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCompleted((c) => c + 1), 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, steps.length]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Sparkles size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.list}>
        {steps.map((step, i) => {
          const done = i < completed;
          const active = i === completed;
          return (
            <View
              key={step}
              style={[
                styles.row,
                done && { backgroundColor: colors.successSoft, borderColor: "transparent" },
                active && { backgroundColor: colors.primarySoft, borderColor: "transparent" },
              ]}
            >
              {done ? (
                <Check size={16} color={colors.success} />
              ) : active ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.emptyDot} />
              )}
              <Text
                style={[
                  styles.rowText,
                  done && { color: colors.success },
                  active && { color: colors.primaryHover, fontWeight: "600" },
                ]}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: spacing.xxl, gap: spacing.md },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center", marginTop: -8 },
  list: { width: "100%", gap: 8, marginTop: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  rowText: { fontSize: fontSize.sm, color: colors.foregroundMuted, flexShrink: 1 },
  emptyDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.borderStrong },
});

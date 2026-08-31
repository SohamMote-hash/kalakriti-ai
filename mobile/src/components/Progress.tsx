import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius } from "@/constants/theme";

export function StepProgressBar({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}

export function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i === active ? colors.primary : colors.borderStrong, width: i === active ? 20 : 8 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stepLabel: { fontSize: fontSize.xs, fontWeight: "700", color: colors.foregroundMuted, letterSpacing: 0.6 },
  track: { height: 6, borderRadius: radius.full, backgroundColor: colors.surfaceMuted, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.primary, borderRadius: radius.full },
  dot: { height: 8, borderRadius: 4 },
});

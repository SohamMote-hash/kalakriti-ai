import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors, fontSize, spacing } from "@/constants/theme";

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
        <ArrowLeft size={20} color={colors.foreground} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
});

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Store, User } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import type { UserRole } from "@/types";

export default function RoleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  function choose(role: UserRole) {
    setRole(role);
    completeOnboarding();
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("role.title")}</Text>
        <Text style={styles.subtitle}>{t("role.subtitle")}</Text>
      </View>

      <View style={styles.options}>
        <Pressable style={styles.card} onPress={() => choose("artisan")}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
            <User size={30} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{t("role.artisanTitle")}</Text>
          <Text style={styles.cardBody}>{t("role.artisanBody")}</Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => choose("buyer")}>
          <View style={[styles.iconCircle, { backgroundColor: colors.secondarySoft }]}>
            <Store size={30} color={colors.secondary} />
          </View>
          <Text style={styles.cardTitle}>{t("role.buyerTitle")}</Text>
          <Text style={styles.cardBody}>{t("role.buyerBody")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl, alignItems: "center" },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center", marginTop: 6 },
  options: { padding: spacing.xl, gap: spacing.lg },
  card: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    alignItems: "flex-start",
    gap: 6,
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  cardTitle: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  cardBody: { fontSize: fontSize.sm, color: colors.foregroundMuted },
});

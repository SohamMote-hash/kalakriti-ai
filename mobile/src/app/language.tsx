import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Globe } from "lucide-react-native";
import { Button } from "@/components/ui";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import type { Language } from "@/types";

const OPTIONS: { code: Language; native: string; english: string }[] = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "mr", native: "मराठी", english: "Marathi" },
];

export default function LanguageScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const storeLanguage = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [selected, setSelected] = useState<Language>(storeLanguage);

  function handleContinue() {
    setLanguage(selected);
    router.push("/role");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Globe size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>{t("language.title")}</Text>
        <Text style={styles.subtitle}>{t("language.subtitle")}</Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map((opt) => {
          const active = selected === opt.code;
          return (
            <Pressable key={opt.code} style={[styles.option, active && styles.optionActive]} onPress={() => setSelected(opt.code)}>
              <View>
                <Text style={[styles.optionNative, active && { color: colors.primaryHover }]}>{opt.native}</Text>
                <Text style={styles.optionEnglish}>{opt.english}</Text>
              </View>
              {active && (
                <View style={styles.checkCircle}>
                  <Check size={14} color={colors.white} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button label={t("common.continue")} onPress={handleContinue} size="lg" fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  header: { alignItems: "center", paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center", marginTop: 6 },
  options: { paddingHorizontal: spacing.xl, gap: spacing.md },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionNative: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  optionEnglish: { fontSize: fontSize.xs, color: colors.foregroundMuted, marginTop: 2 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
});

import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, Globe, Package, Repeat, Sparkles } from "lucide-react-native";
import { Avatar, Button, Card, TextAreaField, TextField } from "@/components/ui";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";
import type { Language } from "@/types";

const LANGUAGES: { code: Language; native: string }[] = [
  { code: "en", native: "English" },
  { code: "hi", native: "हिन्दी" },
  { code: "mr", native: "मराठी" },
];

export default function ProfileTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const products = useAppStore((s) => s.products);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [form, setForm] = useState({
    name: currentArtisan.name,
    craft: currentArtisan.craftSpecialization,
    city: currentArtisan.location,
    bio: currentArtisan.bio,
  });
  const [saved, setSaved] = useState(false);

  const myProducts = products.filter((p) => p.artisanId === currentArtisan.id);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t("profile.title")}</Text>

        {role === "artisan" && (
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.profileHeader}>
              <Avatar initials={currentArtisan.initials} color={currentArtisan.avatarColor} size={56} />
              <View>
                <Text style={styles.name}>{form.name}</Text>
                <Text style={styles.memberSince}>
                  {t("profile.memberSince", { year: currentArtisan.memberSince, rating: currentArtisan.rating })}
                </Text>
              </View>
            </View>

            <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
              <TextField label={t("profile.fieldFullName")} value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
              <TextField label={t("profile.fieldCraft")} value={form.craft} onChangeText={(v) => setForm((f) => ({ ...f, craft: v }))} />
              <TextField label={t("profile.fieldCity")} value={form.city} onChangeText={(v) => setForm((f) => ({ ...f, city: v }))} />
              <TextAreaField label={t("profile.fieldBio")} value={form.bio} onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))} />
              <Button label={saved ? t("profile.saved") : t("profile.saveChanges")} onPress={handleSave} />
            </View>
          </Card>
        )}

        <Pressable onPress={() => router.push("/my-products")}>
          <Card style={[styles.row, { marginTop: spacing.lg }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
              <Package size={18} color={colors.white} />
            </View>
            <Text style={styles.rowLabel}>{t("profile.myProducts")}</Text>
            <Text style={styles.rowValue}>{myProducts.length}</Text>
            <ChevronRight size={18} color={colors.foregroundMuted} />
          </Card>
        </Pressable>

        <Pressable onPress={() => setLanguageOpen((o) => !o)}>
          <Card style={[styles.row, { marginTop: spacing.md }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.info }]}>
              <Globe size={18} color={colors.white} />
            </View>
            <Text style={styles.rowLabel}>{t("profile.language")}</Text>
            <Text style={styles.rowValue}>{LANGUAGES.find((l) => l.code === language)?.native}</Text>
            <ChevronRight size={18} color={colors.foregroundMuted} />
          </Card>
        </Pressable>

        {languageOpen && (
          <Card style={{ marginTop: spacing.sm }}>
            {LANGUAGES.map((l) => (
              <Pressable key={l.code} style={styles.langOption} onPress={() => setLanguage(l.code)}>
                <Text style={styles.langText}>{l.native}</Text>
                {language === l.code && <Check size={16} color={colors.primary} />}
              </Pressable>
            ))}
          </Card>
        )}

        <Pressable onPress={() => setRole(role === "artisan" ? "buyer" : "artisan")}>
          <Card style={[styles.row, { marginTop: spacing.md }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
              <Repeat size={18} color={colors.white} />
            </View>
            <Text style={styles.rowLabel}>{role === "artisan" ? t("profile.switchToBuyer") : t("profile.switchToArtisan")}</Text>
            <ChevronRight size={18} color={colors.foregroundMuted} />
          </Card>
        </Pressable>

        <Card style={{ marginTop: spacing.md, marginBottom: spacing.xxxl }}>
          <View style={styles.row}>
            <Sparkles size={18} color={colors.accent} />
            <Text style={styles.rowLabel}>{t("profile.aiPreferences")}</Text>
          </View>
          <Text style={styles.aiBody}>{t("profile.aiPreferencesBody")}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  name: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  memberSince: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconWrap: { width: 36, height: 36, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  rowLabel: { flex: 1, fontSize: fontSize.base, fontWeight: "600", color: colors.foreground },
  rowValue: { fontSize: fontSize.sm, color: colors.foregroundMuted },
  langOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  langText: { fontSize: fontSize.base, color: colors.foreground },
  aiBody: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: spacing.sm, lineHeight: 20 },
});

import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Mic } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { colors, fontSize, radius } from "@/constants/theme";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export function VoiceInputButton({ onResult, compact }: { onResult: (text: string) => void; compact?: boolean }) {
  const { t } = useTranslation();
  const { listening, start } = useVoiceInput(onResult);

  if (compact) {
    return (
      <Pressable
        onPress={start}
        disabled={listening}
        style={[styles.compactButton, listening && { backgroundColor: colors.primary }]}
      >
        {listening ? <ActivityIndicator size="small" color={colors.white} /> : <Mic size={16} color={colors.primary} />}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={start} disabled={listening} style={styles.wrapper}>
      <View style={[styles.circle, listening && styles.circleActive]}>
        {listening ? <ActivityIndicator color={colors.white} /> : <Mic size={20} color={colors.primary} />}
      </View>
      <Text style={styles.label}>{listening ? t("voice.listening") : t("voice.tapToSpeak")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: { backgroundColor: colors.primary },
  label: { fontSize: fontSize.sm, color: colors.foregroundMuted, fontWeight: "600" },
  compactButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});

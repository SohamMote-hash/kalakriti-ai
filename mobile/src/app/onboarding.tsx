import React, { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, Store, TrendingUp } from "lucide-react-native";
import { Button } from "@/components/ui";
import { Dots } from "@/components/Progress";
import { colors, fontSize, spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const slides = [
    { icon: Sparkles, title: t("onboarding.slide1Title"), body: t("onboarding.slide1Body") },
    { icon: TrendingUp, title: t("onboarding.slide2Title"), body: t("onboarding.slide2Body") },
    { icon: Store, title: t("onboarding.slide3Title"), body: t("onboarding.slide3Body") },
  ];

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  }

  function goNext() {
    if (index < slides.length - 1) {
      const nextIndex = index + 1;
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setIndex(nextIndex);
    } else {
      router.push("/language");
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <View key={slide.title} style={[styles.slide, { width }]}>
              <View style={styles.iconCircle}>
                <Icon size={48} color={colors.primary} strokeWidth={1.5} />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Dots count={slides.length} active={index} />
        <Button
          label={index === slides.length - 1 ? t("onboarding.getStarted") : t("common.continue")}
          onPress={goNext}
          size="lg"
          fullWidth
          style={{ marginTop: spacing.xl }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl },
  iconCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: spacing.sm },
  body: { fontSize: fontSize.base, color: colors.foregroundMuted, textAlign: "center", lineHeight: 22 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
});

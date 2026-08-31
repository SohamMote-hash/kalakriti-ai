import "@/i18n";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHydration } from "@/hooks/useHydration";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="language" />
        <Stack.Screen name="role" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product-studio" options={{ presentation: "card" }} />
        <Stack.Screen name="product/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="market-analysis" />
        <Stack.Screen name="financial-planner" />
        <Stack.Screen name="business-plan" />
        <Stack.Screen name="b2b-opportunities" />
        <Stack.Screen name="my-products" />
      </Stack>
    </SafeAreaProvider>
  );
}

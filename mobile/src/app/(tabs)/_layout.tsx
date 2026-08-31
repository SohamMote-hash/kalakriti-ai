import React from "react";
import { View } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Home, LayoutGrid, Sparkles, Store, User } from "lucide-react-native";
import { colors } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";

export default function TabsLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const role = useAppStore((s) => s.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.home"),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: t("nav.marketplace"),
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t("nav.create"),
          tabBarIcon: () => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Sparkles color={colors.white} size={20} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (role === "buyer") {
              router.push("/(tabs)/marketplace");
            } else {
              router.push("/product-studio");
            }
          },
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t("nav.insights"),
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("nav.profile"),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

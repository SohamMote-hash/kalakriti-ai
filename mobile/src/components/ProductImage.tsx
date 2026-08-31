import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CATEGORY_GRADIENT, CATEGORY_ICON } from "@/constants/categories";
import type { CraftCategory } from "@/types";

export function ProductImage({
  category,
  size = 100,
  iconSize,
  style,
  radius = 14,
  fullWidth = false,
}: {
  category: CraftCategory;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** Fill the parent's width (for hero/card images) instead of a fixed square. */
  fullWidth?: boolean;
}) {
  const Icon = CATEGORY_ICON[category];
  const gradient = CATEGORY_GRADIENT[category] ?? CATEGORY_GRADIENT["Home Decor"];

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { height: size, width: fullWidth ? "100%" : size, borderRadius: radius },
        style,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon size={iconSize ?? size * 0.32} color="rgba(255,255,255,0.92)" strokeWidth={1.5} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 },
  iconWrap: { alignItems: "center", justifyContent: "center" },
});

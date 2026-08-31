import React from "react";
import { View } from "react-native";

// This tab is intercepted in (tabs)/_layout.tsx's tabPress listener and
// never actually navigated to — it routes to /product-studio (artisan) or
// the marketplace (buyer) instead. Kept as an empty fallback route.
export default function CreateTabPlaceholder() {
  return <View />;
}

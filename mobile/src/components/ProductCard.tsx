import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
import { ProductImage } from "./ProductImage";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { formatCurrency } from "@/utils/format";
import { getArtisanById } from "@/data/seedArtisans";
import type { Product } from "@/types";

export function ProductCard({
  product,
  saved,
  onToggleSave,
  width,
}: {
  product: Product;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  width?: number;
}) {
  const router = useRouter();
  const artisan = getArtisanById(product.artisanId);

  return (
    <Pressable
      style={[styles.card, width ? { width } : { flexBasis: "47%", flexGrow: 1 }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View>
        <ProductImage
          category={product.category}
          size={140}
          radius={0}
          fullWidth
          style={{ borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md }}
        />
        {onToggleSave && (
          <Pressable
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave(product.id);
            }}
            hitSlop={8}
          >
            <Heart size={16} color={saved ? colors.danger : colors.foregroundMuted} fill={saved ? colors.danger : "transparent"} />
          </Pressable>
        )}
      </View>
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        {artisan && (
          <View style={styles.row}>
            <MapPin size={11} color={colors.foregroundMuted} />
            <Text numberOfLines={1} style={styles.location}>
              {artisan.name} · {artisan.location}
            </Text>
          </View>
        )}
        <View style={[styles.row, { justifyContent: "space-between", marginTop: 4 }]}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {artisan && (
            <View style={styles.row}>
              <Star size={11} color={colors.accent} fill={colors.accent} />
              <Text style={styles.rating}>{artisan.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: spacing.sm, gap: 2 },
  name: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground, minHeight: 34 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 11, color: colors.foregroundMuted, flexShrink: 1 },
  price: { fontSize: fontSize.base, fontWeight: "700", color: colors.primary },
  rating: { fontSize: 11, color: colors.foregroundMuted },
});

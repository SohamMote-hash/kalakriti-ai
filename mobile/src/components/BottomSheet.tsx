import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, title, subtitle, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
              <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
                <X size={18} color={colors.foregroundMuted} />
              </Pressable>
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(20,15,10,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    maxHeight: "88%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
});

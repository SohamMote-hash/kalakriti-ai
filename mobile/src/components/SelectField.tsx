import React, { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

interface SelectFieldProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, placeholder, onChange }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={{ gap: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, !selected && { color: colors.foregroundMuted }]}>
          {selected ? selected.label : placeholder ?? "Select"}
        </Text>
        <ChevronDown size={18} color={colors.foregroundMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 420 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {item.value === value && <Check size={18} color={colors.primary} />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 50,
    backgroundColor: colors.surface,
  },
  triggerText: { fontSize: fontSize.base, color: colors.foreground },
  overlay: { flex: 1, backgroundColor: "rgba(20,15,10,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    maxHeight: "70%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: { fontSize: fontSize.base, color: colors.foreground },
});

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

// ---------- Button ----------

type ButtonVariant = "primary" | "secondary" | "outline" | "soft" | "ghost";
type ButtonSize = "md" | "lg" | "sm";

interface ButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BUTTON_BG: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  outline: colors.surface,
  soft: colors.primarySoft,
  ghost: "transparent",
};

const BUTTON_TEXT: Record<ButtonVariant, string> = {
  primary: colors.primaryForeground,
  secondary: colors.secondaryForeground,
  outline: colors.foreground,
  soft: colors.primaryHover,
  ghost: colors.foreground,
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  icon,
  loading,
  fullWidth,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const height = size === "lg" ? 56 : size === "sm" ? 40 : 48;
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: BUTTON_BG[variant],
          height,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor: colors.borderStrong,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={BUTTON_TEXT[variant]} />
      ) : (
        <>
          {icon}
          <Text style={[styles.buttonText, { color: BUTTON_TEXT[variant], fontSize: size === "lg" ? 17 : 15 }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ---------- Card ----------

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---------- Badge ----------

type BadgeTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info" | "neutral";

const BADGE_BG: Record<BadgeTone, string> = {
  primary: colors.primarySoft,
  secondary: colors.secondarySoft,
  accent: colors.accentSoft,
  success: colors.successSoft,
  warning: colors.warningSoft,
  danger: colors.dangerSoft,
  info: colors.infoSoft,
  neutral: colors.surfaceMuted,
};
const BADGE_TEXT: Record<BadgeTone, string> = {
  primary: colors.primaryHover,
  secondary: colors.secondary,
  accent: "#7a5c1a",
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
  neutral: colors.foregroundMuted,
};

export function Badge({ label, tone = "primary", style }: { label: string; tone?: BadgeTone; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.badge, { backgroundColor: BADGE_BG[tone] }, style]}>
      <Text style={[styles.badgeText, { color: BADGE_TEXT[tone] }]}>{label}</Text>
    </View>
  );
}

// ---------- AI Badge ----------

export function AIBadge({ label }: { label: string }) {
  return (
    <View style={styles.aiBadge}>
      <Sparkles size={12} color={colors.primaryHover} />
      <Text style={styles.aiBadgeText}>{label}</Text>
    </View>
  );
}

// ---------- Text field ----------

interface TextFieldProps extends TextInputProps {
  label?: string;
  hint?: string;
}

export function TextField({ label, hint, style, ...props }: TextFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.foregroundMuted}
        style={[styles.input, style as TextStyle]}
        {...props}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

export function TextAreaField({ label, hint, style, ...props }: TextFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.foregroundMuted}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea, style as TextStyle]}
        {...props}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

// ---------- Empty state ----------

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.emptyState}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      {body && <Text style={styles.emptyBody}>{body}</Text>}
      {action}
    </View>
  );
}

// ---------- Avatar ----------

export function Avatar({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.white, fontWeight: "700", fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
  },
  buttonText: { fontWeight: "600" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    shadowColor: "#1a140c",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: "600" },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignSelf: "flex-start",
  },
  aiBadgeText: { fontSize: 11, fontWeight: "700", color: colors.primaryHover },
  label: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground },
  hint: { fontSize: fontSize.xs, color: colors.foregroundMuted },
  input: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.base,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  textArea: { minHeight: 96, paddingTop: 12 },
  emptyState: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  emptyBody: { fontSize: fontSize.sm, color: colors.foregroundMuted, textAlign: "center" },
  sectionTitle: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  sectionSubtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
});

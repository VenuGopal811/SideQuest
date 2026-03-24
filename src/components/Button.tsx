/**
 * Button.tsx
 *
 * Reusable button component using TouchableOpacity (React Native).
 * NOT using <button> (HTML). Works on Android + iOS.
 * 4 variants: primary | secondary | danger | ghost
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { Colors, Spacing, Radius } from "../styles/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    // TouchableOpacity — the correct RN tap handler (not onClick)
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.72}
      // accessibilityRole makes screen readers announce this as a button
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#fff" : Colors.accent}
        />
      ) : (
        <Text style={[styles.label, variantStyles[variant].label]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.4,
  },
});

// Variant styles separated for clarity
const variantStyles = {
  primary: StyleSheet.create({
    container: {
      backgroundColor: Colors.accent,
      shadowColor: Colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6, // Android shadow
    },
    label: {
      color: "#fff",
    },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: Colors.bgElevated,
      borderWidth: 1,
      borderColor: Colors.borderActive,
    },
    label: {
      color: Colors.accent,
    },
  }),
  danger: StyleSheet.create({
    container: {
      backgroundColor: Colors.error + "20",
      borderWidth: 1,
      borderColor: Colors.error + "40",
    },
    label: {
      color: Colors.error,
    },
  }),
  ghost: StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    label: {
      color: Colors.textSecondary,
    },
  }),
};

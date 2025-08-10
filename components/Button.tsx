import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { LucideIcon } from "lucide-react-native";
import Colors from "@/constants/Colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  const iconStyles = [
    styles.icon,
    styles[`${size}Icon`],
    iconPosition === "right" && styles.iconRight,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={textStyles}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {Icon && iconPosition === "left" && (
            <Icon style={iconStyles} size={getIconSize(size)} color={getIconColor(variant, disabled)} />
          )}
          <Text style={textStyles}>{title}</Text>
          {Icon && iconPosition === "right" && (
            <Icon style={iconStyles} size={getIconSize(size)} color={getIconColor(variant, disabled)} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function getIconSize(size: string): number {
  switch (size) {
    case "small": return 16;
    case "large": return 24;
    default: return 20;
  }
}

function getIconColor(variant: string, disabled: boolean): string {
  if (disabled) return "#999999";
  
  switch (variant) {
    case "primary": return "#ffffff";
    case "secondary": return "#ffffff";
    case "outline": return Colors.primary;
    case "ghost": return Colors.primary;
    default: return "#ffffff";
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary || "#6c757d",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#ffffff",
  },
  secondaryText: {
    color: "#ffffff",
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: "#999999",
  },
  icon: {
    marginHorizontal: 0,
  },
  smallIcon: {
    marginHorizontal: 0,
  },
  mediumIcon: {
    marginHorizontal: 0,
  },
  largeIcon: {
    marginHorizontal: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    borderTopColor: "#ffffff",
    animation: "spin 1s linear infinite",
  },
});
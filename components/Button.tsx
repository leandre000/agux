import Colors from "@/constants/Colors";
import { LucideIcon } from "lucide-react-native";
import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    Animated,
    ActivityIndicator,
    Platform,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning" | "gradient";
  size?: "small" | "medium" | "large" | "xl";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  gradientColors?: string[];
}

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  rounded = false,
  disabled = false,
  ripple = true,
  gradientColors,
  style,
  ...props
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (ripple && !disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (ripple && !disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    rounded && styles.rounded,
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

  const getButtonContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size={getSpinnerSize(size)} 
            color={getSpinnerColor(variant, disabled)} 
          />
          <Text style={[textStyles, styles.loadingText]}>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        {Icon && iconPosition === "left" && (
          <Icon 
            style={iconStyles} 
            size={getIconSize(size)} 
            color={getIconColor(variant, disabled)} 
          />
        )}
        <Text style={textStyles}>{title}</Text>
        {Icon && iconPosition === "right" && (
          <Icon 
            style={iconStyles} 
            size={getIconSize(size)} 
            color={getIconColor(variant, disabled)} 
          />
        )}
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <TouchableOpacity
        style={buttonStyles}
        disabled={disabled || loading}
        activeOpacity={ripple ? 1 : 0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {getButtonContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}

function getIconSize(size: string): number {
  switch (size) {
    case "small": return 16;
    case "large": return 22;
    case "xl": return 24;
    default: return 20;
  }
}

function getSpinnerSize(size: string): number {
  switch (size) {
    case "small": return 16;
    case "large": return 20;
    case "xl": return 24;
    default: return 18;
  }
}

function getIconColor(variant: string, disabled: boolean): string {
  if (disabled) return "#999999";
  
  switch (variant) {
    case "primary": return "#ffffff";
    case "secondary": return "#ffffff";
    case "outline": return Colors.primary;
    case "ghost": return Colors.primary;
    case "danger": return "#ffffff";
    case "success": return "#ffffff";
    case "warning": return "#ffffff";
    case "gradient": return "#ffffff";
    default: return "#ffffff";
  }
}

function getSpinnerColor(variant: string, disabled: boolean): string {
  if (disabled) return "#999999";
  
  switch (variant) {
    case "primary": return "#ffffff";
    case "secondary": return "#ffffff";
    case "outline": return Colors.primary;
    case "ghost": return Colors.primary;
    case "danger": return "#ffffff";
    case "success": return "#ffffff";
    case "warning": return "#ffffff";
    case "gradient": return "#ffffff";
    default: return "#ffffff";
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: Colors.error,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  gradient: {
    backgroundColor: Colors.primary,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  xl: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    minHeight: 64,
  },
  
  // Modifiers
  fullWidth: {
    width: "100%",
  },
  rounded: {
    borderRadius: 50,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: Colors.border,
  },
  
  // Content
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
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
  
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
  xlText: {
    fontSize: 20,
  },
  
  // Variant text colors
  primaryText: {
    color: "#ffffff",
  },
  secondaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: "#ffffff",
  },
  successText: {
    color: "#ffffff",
  },
  warningText: {
    color: "#ffffff",
  },
  gradientText: {
    color: "#ffffff",
  },
  
  // Disabled text
  disabledText: {
    color: "#999999",
  },
  
  // Icon styles
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
  xlIcon: {
    marginHorizontal: 0,
  },
  iconRight: {
    marginLeft: 8,
    marginRight: 0,
  },
});
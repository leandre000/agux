import Colors from "@/constants/Colors";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  variant?: "default" | "large" | "compact";
}

export default function SectionHeader({
  title,
  subtitle,
  showSeeAll = false,
  onSeeAllPress,
  variant = "default",
}: SectionHeaderProps) {
  const titleStyles = [
    styles.title,
    styles[`${variant}Title`],
  ];

  const subtitleStyles = [
    styles.subtitle,
    styles[`${variant}Subtitle`],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={titleStyles}>{title}</Text>
        {subtitle && <Text style={subtitleStyles}>{subtitle}</Text>}
      </View>
      
      {showSeeAll && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  defaultTitle: {
    fontSize: 20,
  },
  largeTitle: {
    fontSize: 24,
  },
  compactTitle: {
    fontSize: 18,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  defaultSubtitle: {
    fontSize: 14,
  },
  largeSubtitle: {
    fontSize: 16,
  },
  compactSubtitle: {
    fontSize: 13,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(230, 0, 126, 0.1)",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
});

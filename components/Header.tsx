import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Menu, Bell, Search } from "lucide-react-native";
import Colors from "@/constants/Colors";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showBell?: boolean;
  showSearch?: boolean;
  showLogo?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onBellPress?: () => void;
  onSearchPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showMenu = false,
  showBell = false,
  showSearch = false,
  showLogo = false,
  showProfile = false,
  onMenuPress,
  onBellPress,
  onSearchPress,
  rightComponent,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ChevronLeft size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          
          {showMenu && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMenuPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Menu size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleSection}>
          {showLogo ? (
            <Text style={styles.logo}>AGURA</Text>
          ) : title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightSection}>
          {showSearch && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Search size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          
          {showBell && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBellPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Bell size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
  },
  titleSection: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
});

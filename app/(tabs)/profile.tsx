import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  CreditCard,
  Heart,
  FileText
} from "lucide-react-native";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileMenuItems = [
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: Edit3,
      onPress: () => router.push("/profile/setup"),
      color: Colors.primary,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage your notification preferences",
      icon: Bell,
      onPress: () => router.push("/profile/notifications"),
      color: "#10b981",
    },
    {
      id: "payment",
      title: "Payment Methods",
      subtitle: "Manage your payment options",
      icon: CreditCard,
      onPress: () => router.push("/profile/payment-methods"),
      color: "#f59e0b",
    },
    {
      id: "tickets",
      title: "My Tickets",
      subtitle: "View and manage your tickets",
      icon: FileText,
      onPress: () => router.push("/(tabs)/tickets"),
      color: "#8b5cf6",
    },
    {
      id: "favorites",
      title: "Favorites",
      subtitle: "Events you've saved",
      icon: Heart,
      onPress: () => router.push("/profile/favorites"),
      color: "#ef4444",
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "App preferences and configuration",
      icon: Settings,
      onPress: () => router.push("/profile/settings"),
      color: "#6b7280",
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: HelpCircle,
      onPress: () => router.push("/profile/help-support"),
      color: "#3b82f6",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
      icon: Shield,
      onPress: () => router.push("/profile/privacy"),
      color: "#059669",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Profile" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/profile.jpg")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit3 size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || "User Name"}</Text>
          <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          
          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            icon={Edit3}
            onPress={() => router.push("/profile/setup")}
            style={styles.editProfileButton}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            variant="ghost"
            size="large"
            icon={LogOut}
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Agura v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  editProfileButton: {
    minWidth: 120,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  logoutButton: {
    borderColor: "#ef4444",
  },
  versionSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});

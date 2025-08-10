import Button from "@/components/Button";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import {
    Bell,
    Calendar,
    ChevronRight,
    CreditCard,
    DollarSign,
    Edit3,
    FileText,
    Grid3X3,
    Heart,
    HelpCircle,
    LogOut,
    MapPin,
    MessageCircle,
    Settings,
    Share2,
    Shield,
    Star
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Mock user statistics
  const userStats = {
    eventsAttended: 24,
    ticketsPurchased: 31,
    totalSpent: 1247,
    averageRating: 4.8,
    favoriteCategories: ["Music", "Tech", "Food"],
    memberSince: "2023",
  };

  // Mock achievements
  const achievements = [
    { id: "1", title: "First Event", description: "Attended your first event", icon: "🎉", unlocked: true },
    { id: "2", title: "Regular Attendee", description: "Attended 10+ events", icon: "🎯", unlocked: true },
    { id: "3", title: "Music Lover", description: "Attended 5 music events", icon: "🎵", unlocked: true },
    { id: "4", title: "Tech Enthusiast", description: "Attended 3 tech events", icon: "💻", unlocked: false },
    { id: "5", title: "Social Butterfly", description: "Shared 10 events", icon: "🦋", unlocked: false },
    { id: "6", title: "Early Bird", description: "Booked 5+ events in advance", icon: "🌅", unlocked: true },
    { id: "7", title: "Foodie", description: "Attended 3 food & wine events", icon: "🍷", unlocked: false },
    { id: "8", title: "VIP Member", description: "Spent over $1000 on events", icon: "👑", unlocked: true },
  ];

  // Mock recent activity
  const recentActivity = [
    { id: "1", type: "ticket", title: "Purchased ticket for Summer Music Festival", time: "2 hours ago", icon: FileText },
    { id: "2", type: "event", title: "Attended Tech Startup Meetup", time: "1 day ago", icon: Calendar },
    { id: "3", type: "favorite", title: "Added Food & Wine Expo to favorites", time: "2 days ago", icon: Heart },
    { id: "4", type: "share", title: "Shared Agura Launch Event", time: "3 days ago", icon: Share2 },
    { id: "5", type: "review", title: "Rated Jazz Night 5 stars", time: "4 days ago", icon: Star },
    { id: "6", type: "payment", title: "Updated payment method", time: "1 week ago", icon: CreditCard },
  ];

  const profileMenuItems = [
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: Edit3,
      onPress: () => router.push("/profile/setup"),
      color: Colors.primary,
      badge: null,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage your notification preferences",
      icon: Bell,
      onPress: () => router.push("/profile/notifications"),
      color: "#10b981",
      badge: 3,
    },
    {
      id: "payment",
      title: "Payment Methods",
      subtitle: "Manage your payment options",
      icon: CreditCard,
      onPress: () => router.push("/profile/payment-methods"),
      color: "#f59e0b",
      badge: null,
    },
    {
      id: "tickets",
      title: "My Tickets",
      subtitle: "View and manage your tickets",
      icon: FileText,
      onPress: () => router.push("/(tabs)/tickets"),
      color: "#8b5cf6",
      badge: 2,
    },
    {
      id: "favorites",
      title: "Favorites",
      subtitle: "Events you've saved",
      icon: Heart,
      onPress: () => {
        // For now, just log since we don't have a dedicated favorites screen
        console.log('Navigate to favorites');
      },
      color: "#ef4444",
      badge: 8,
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "App preferences and configuration",
      icon: Settings,
      onPress: () => router.push("/profile/settings"),
      color: "#6b7280",
      badge: null,
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: HelpCircle,
      onPress: () => router.push("/profile/help-support"),
      color: "#3b82f6",
      badge: null,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
      icon: Shield,
      onPress: () => {
        // For now, just log since we don't have a dedicated privacy screen
        console.log('Navigate to privacy settings');
      },
      color: "#059669",
      badge: null,
    },
    {
      id: "categories",
      title: "Favorite Categories",
      subtitle: "Manage your event preferences",
      icon: Grid3X3,
      onPress: () => router.push("/profile/categories"),
      color: "#ec4899",
      badge: 3,
    },
    {
      id: "contact",
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      icon: MessageCircle,
      onPress: () => router.push("/profile/contact"),
      color: "#06b6d4",
      badge: null,
    },
  ];

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Your Activity</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: `${Colors.primary}15` }]}>
            <Calendar size={20} color={Colors.primary} />
          </View>
          <Text style={styles.statNumber}>{userStats.eventsAttended}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#10b98115" }]}>
            <FileText size={20} color="#10b981" />
          </View>
          <Text style={styles.statNumber}>{userStats.ticketsPurchased}</Text>
          <Text style={styles.statLabel}>Tickets</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#f59e0b15" }]}>
            <DollarSign size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statNumber}>${userStats.totalSpent}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: "#8b5cf615" }]}>
            <Star size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statNumber}>{userStats.averageRating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <TouchableOpacity onPress={() => {
          // For now, just log since we don't have a dedicated achievements screen
          console.log('Navigate to achievements');
        }}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsList}>
        {achievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={styles.achievementCard}
            onPress={() => {
              // For now, just log since we don't have a dedicated achievement detail screen
              console.log('View achievement:', achievement.id);
            }}
            activeOpacity={0.7}
          >
            <View style={[
              styles.achievementIcon,
              !achievement.unlocked && styles.achievementIconLocked
            ]}>
              <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            </View>
            <Text style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.achievementTitleLocked
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              !achievement.unlocked && styles.achievementDescriptionLocked
            ]}>
              {achievement.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.activitySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => {
          // For now, just log since we don't have a dedicated activity screen
          console.log('Navigate to activity');
        }}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.activityList}>
        {recentActivity.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityItem}
            onPress={() => {
              // For now, just log since we don't have a dedicated activity detail screen
              console.log('View activity:', activity.id);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.activityIcon, { backgroundColor: `${Colors.primary}15` }]}>
              <activity.icon size={16} color={Colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Profile" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/profile.jpg")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit3 size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{user?.username || "User Name"}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push("/profile/setup")}
              activeOpacity={0.7}
            >
              <Edit3 size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          
          <View style={styles.userMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.metaText}>Member since {userStats.memberSince}</Text>
            </View>
            <View style={styles.metaItem}>
              <Star size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.metaText}>{userStats.averageRating} average rating</Text>
            </View>
          </View>
          
          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            icon={Edit3}
            onPress={() => router.push("/profile/setup")}
            style={styles.editProfileButton}
          />
        </Animated.View>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Achievements */}
        {renderAchievements()}

        {/* Recent Activity */}
        {renderRecentActivity()}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
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
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <ChevronRight size={20} color={Colors.textSecondary} />
              </View>
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
  userMeta: {
    marginBottom: 24,
    alignItems: "center",
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  editProfileButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 6,
    fontWeight: "500",
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

  statsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  achievementsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    width: 120,
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.3,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: Colors.textSecondary,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  achievementDescriptionLocked: {
    opacity: 0.6,
  },
  activitySection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
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

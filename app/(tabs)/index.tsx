import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { spacing, radius } from "@/constants/spacing";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { useRouter } from "expo-router";
import {
    Bell
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { featuredEvents, allEvents, loading } = useEventsStore();
  
  // Compute upcoming events from all events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, [allEvents]);

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "music festival",
    "tech conference",
    "food expo",
    "art exhibition"
  ]);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    "summer events",
    "live music",
    "sports games",
    "business networking"
  ]);

  const quickActions = [
    {
      id: "1",
      title: "My Tickets",
      icon: "🎫",
      color: Colors.primary,
      onPress: () => router.push("/(tabs)/tickets")
    },
    {
      id: "2",
      title: "Book Event",
      icon: "📅",
      color: "#3b82f6",
      onPress: () => router.push("/(tabs)/events-user")
    },
    {
      id: "3",
      title: "Food & Drinks",
      icon: "🍔",
      color: "#f59e0b",
      onPress: () => router.push("/(tabs)/events-user")
    },
    {
      id: "4",
      title: "Get Help",
      icon: "❓",
      color: "#10b981",
      onPress: () => router.push("/profile/help-support")
    }
  ];

  const categories = [
    { name: "Music", icon: "🎵", color: Colors.primary },
    { name: "Sports", icon: "⚽", color: Colors.success },
    { name: "Technology", icon: "💻", color: Colors.info },
    { name: "Food", icon: "🍕", color: Colors.warning },
    { name: "Art", icon: "🎨", color: Colors.error },
    { name: "Business", icon: "💼", color: Colors.primaryLight }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);
      
      // For now, just update local state since we don't have a dedicated search screen
      console.log('Searching for:', query.trim());
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleViewAllEvents = () => {
    router.push("/(tabs)/events-user");
  };

  const handleViewAllUpcoming = () => {
    router.push("/(tabs)/events/upcoming");
  };

  const handleQuickAction = (action: any) => {
    action.onPress();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "You have 3 new notifications");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello, {user?.username || 'Guest'}! 👋</Text>
            <Text style={styles.subtitle}>Discover amazing events today</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={handleNotificationPress}
            activeOpacity={0.8}
          >
            <Bell size={24} color={Colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search events, venues, or categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          showFilter={true}
          showSuggestions={true}
          recentSearches={recentSearches}
          popularSearches={popularSearches}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { backgroundColor: action.color + '20' }]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Events"
            subtitle="Handpicked events just for you"
            showSeeAll={true}
            onSeeAllPress={handleViewAllEvents}
          />
          {loading ? (
            <View style={[styles.horizontalScroll, { flexDirection: 'row' }]}> 
              <View style={styles.featuredEventContainer}><Skeleton height={200} radius={16} /></View>
              <View style={styles.featuredEventContainer}><Skeleton height={200} radius={16} /></View>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {featuredEvents.map((event) => (
                <View key={event.id} style={styles.featuredEventContainer}>
                  <EventCard
                    event={event}
                    variant="detailed"
                    onPress={() => handleEventPress(event.id)}
                    onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
                    onShare={() => Alert.alert("Share", "Sharing event...")}
                    onBookmark={() => Alert.alert("Bookmark", "Bookmarked event")}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Events"
            subtitle="Events happening soon"
            showSeeAll={true}
            onSeeAllPress={handleViewAllUpcoming}
          />
          {loading ? (
            <View style={{ gap: 12, paddingHorizontal: 20 }}>
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="default"
                onPress={() => handleEventPress(event.id)}
                onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
              />
            ))
          )}
        </View>

        {/* Event Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, { backgroundColor: category.color + '20' }]}
                onPress={() => {
                  // For now, just log the category selection since we don't have dedicated category screens
                  console.log('Selected category:', category.name);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: Colors.card,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionButton: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  featuredEventContainer: {
    width: width - 40,
    marginRight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: 20,
  },
  categoryButton: {
    width: '48%',
    padding: 20,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});
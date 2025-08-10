import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import {
    Bell
} from "lucide-react-native";
import React, { useState } from "react";
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

  const featuredEvents = [
    {
      id: "1",
      title: "Agura Launch Event",
      location: "Downtown Convention Center",
      image: require("@/assets/images/m1.png"),
      price: 25,
      category: "tech",
      date: "2025-01-15T18:00:00.000Z",
      attendees: 150,
      rating: 4.8,
      description: "Join us for the official launch of Agura - the future of event ticketing and management.",
      organizer: "Agura Team"
    },
    {
      id: "2",
      title: "Summer Music Festival",
      location: "Central Park",
      image: require("@/assets/images/m2.png"),
      price: 45,
      category: "music",
      date: "2025-01-20T19:00:00.000Z",
      attendees: 500,
      rating: 4.9,
      description: "Experience the hottest summer beats with top artists from around the world.",
      organizer: "Music Events Inc"
    },
  ];

  const upcomingEvents = [
    {
      id: "3",
      title: "Food & Wine Expo",
      location: "City Hall Plaza",
      image: require("@/assets/images/m1.png"),
      price: 35,
      category: "food",
      date: "2025-01-25T17:00:00.000Z",
      attendees: 200,
      rating: 4.7,
      description: "Taste the finest cuisines and wines from renowned chefs and wineries.",
      organizer: "Culinary Arts Society"
    },
    {
      id: "4",
      title: "Tech Startup Meetup",
      location: "Innovation Hub",
      image: require("@/assets/images/m2.png"),
      price: 0,
      category: "tech",
      date: "2025-01-30T18:30:00.000Z",
      attendees: 75,
      rating: 4.6,
      description: "Connect with fellow entrepreneurs and investors in the tech ecosystem.",
      organizer: "Startup Community"
    },
  ];

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
      title: "Food Orders",
      icon: "🍕",
      color: "#f59e0b",
      onPress: () => router.push("/(tabs)/menu")
    },
    {
      id: "4",
      title: "Profile",
      icon: "👤",
      color: "#10b981",
      onPress: () => router.push("/(tabs)/profile")
    }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);
      
      // Navigate to search results
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
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
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}! 👋</Text>
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
            onPress={handleViewAllEvents}
            showButton={true}
            buttonText="View All"
          />
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
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Events"
            subtitle="Events happening soon"
            onPress={handleViewAllUpcoming}
            showButton={true}
            buttonText="View All"
          />
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="default"
              onPress={() => handleEventPress(event.id)}
              onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
            />
          ))}
        </View>

        {/* Event Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {[
              { name: "Music", icon: "🎵", color: "#e6007e" },
              { name: "Sports", icon: "⚽", color: "#3b82f6" },
              { name: "Food", icon: "🍕", color: "#f59e0b" },
              { name: "Tech", icon: "💻", color: "#10b981" },
              { name: "Art", icon: "🎨", color: "#8b5cf6" },
              { name: "Business", icon: "💼", color: "#6b7280" }
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, { backgroundColor: category.color + '20' }]}
                onPress={() => router.push(`/category/${category.name.toLowerCase()}`)}
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
    padding: 8,
    borderRadius: 20,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
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
    marginBottom: 32,
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
    gap: 12,
    paddingHorizontal: 20,
  },
  categoryButton: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
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
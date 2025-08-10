import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import {
    ArrowRight,
    Bell,
    Calendar,
    Star,
    User
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

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
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header 
        title="Home" 
        showBell={true}
        onBellPress={() => router.push("/notifications")}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {user?.name || "Guest"}! 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Discover amazing events happening around you
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search events, venues, or categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilter={() => router.push("/filters")}
            showFilter={true}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <SectionHeader 
            title="Quick Actions" 
            variant="compact"
          />
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push("/(tabs)/events-user")}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Calendar size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Browse Events</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push("/(tabs)/tickets")}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Star size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>My Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push("/(tabs)/profile")}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <User size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push("/notifications")}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Bell size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Events */}
        <View style={styles.featuredSection}>
          <SectionHeader 
            title="Featured Events" 
            subtitle="Handpicked events you'll love"
            showSeeAll={true}
            onSeeAllPress={handleViewAllEvents}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScrollContent}
          >
            {featuredEvents.map((event) => (
              <View key={event.id} style={styles.featuredEventContainer}>
                <EventCard
                  event={event}
                  variant="featured"
                  onPress={() => handleEventPress(event.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.upcomingSection}>
          <SectionHeader 
            title="Upcoming Events" 
            subtitle="Events happening soon"
            showSeeAll={true}
            onSeeAllPress={handleViewAllUpcoming}
          />
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="compact"
              onPress={() => handleEventPress(event.id)}
            />
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Button
            title="View All Events"
            variant="primary"
            size="large"
            icon={ArrowRight}
            iconPosition="right"
            fullWidth={true}
            onPress={handleViewAllEvents}
          />
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(230, 0, 126, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  featuredScrollContent: {
    paddingRight: 20,
  },
  featuredEventContainer: {
    width: 320,
    marginRight: 16,
  },
  upcomingSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
});
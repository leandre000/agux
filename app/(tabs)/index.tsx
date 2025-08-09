import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import ListEventCard from "@/components/ListEventCard";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { useTicketsStore } from "@/store/tickets-store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { featuredEvents, allEvents, fetchAll, loading, error } = useEventsStore();
  const { fetchUserTickets } = useTicketsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filter events based on search
  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchAll(),
        fetchUserTickets(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSeeAllUpcoming = useCallback(() => {
    router.push("/events/upcoming");
  }, [router]);

  const handleSeeAllAvailable = useCallback(() => {
    router.push("/events/user");
  }, [router]);

  const handleSeeAllBooked = useCallback(() => {
    router.push("/events/user");
  }, [router]);

  const handleSeeAllOrders = useCallback(() => {
    router.push("/(tabs)/tickets");
  }, [router]);

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => router.push("/search")}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search Event"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Upcoming Events */}
        <SectionHeader 
          title="Upcoming Events"
          showSeeAll
          onSeeAllPress={handleSeeAllUpcoming}
        />
        {featuredEvents.length === 0 ? (
          <EmptyState message="No upcoming events available at the moment" />
        ) : (
          <View style={styles.featuredEventContainer}>
            {featuredEvents.slice(0, 1).map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/event/${event.id}`)}
                style={styles.featuredEventCard}
              >
                <EventCard
                  event={event}
                  variant="featured"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Available Events */}
        <SectionHeader 
          title="Available Events"
          showSeeAll
          onSeeAllPress={handleSeeAllAvailable}
        />
        {userEvents.length === 0 ? (
          <EmptyState message="No events available right now" />
        ) : (
          userEvents.slice(0, 2).map((event) => (
            <ListEventCard 
              key={`available-${event.id}`} 
              event={event}
              onPress={() => router.push(`/event/${event.id}`)}
            />
          ))
        )}

        {/* Booked Events */}
        <SectionHeader 
          title="Booked Events"
          showSeeAll
          onSeeAllPress={handleSeeAllBooked}
        />
        {userEvents.filter(e => e.booked).length === 0 ? (
          <EmptyState message="You haven't booked any events yet" />
        ) : (
          userEvents
            .filter(e => e.booked)
            .slice(0, 2)
            .map((event) => (
              <ListEventCard 
                key={`booked-${event.id}`} 
                event={event} 
                isBooked
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))
        )}

        {/* Orders */}
        <SectionHeader 
          title="Orders"
          showSeeAll
          onSeeAllPress={handleSeeAllOrders}
        />
        <View style={styles.ordersSection}>
          <EmptyState message="No orders to display" />
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
    paddingBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  featuredEventContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuredEventCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ordersSection: {
    paddingHorizontal: 20,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
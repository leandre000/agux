import React, { useEffect, useState } from "react";
import { Text, ScrollView, RefreshControl, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import { TicketsAPI } from "@/lib/api";
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react-native';

export default function TicketsTabScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function load() {
    try {
      setError(null);
      const data = await TicketsAPI.getMyTickets();
      setTickets(Array.isArray(data) ? data : data?.tickets || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load your tickets");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Filter tickets based on search
  const filteredTickets = tickets.filter(ticket =>
    ticket.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Mock events for demo (since no backend yet)
  const mockEvents = [
    {
      id: '1',
      title: 'Summer Event',
      subtitle: 'Platini',
      date: '10 May 2025',
      location: 'Serena Hotel Kigali',
      image: require('@/assets/images/m1.png'),
    }
  ];

  const mockOrders = [
    {
      id: '1',
      title: 'Soft Drinks',
      subtitle: 'Coca and Fanta',
      price: '$12.00',
      image: require('@/assets/images/m1.png'),
    }
  ];

  // Event card component
  const EventCard = ({ event }: { event: any }) => (
    <View style={styles.eventCard}>
      <Image source={event.image} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
          <View style={styles.eventMeta}>
            <Calendar size={13} color={Colors.textSecondary} />
            <Text style={styles.eventMetaText}>{event.date}</Text>
          </View>
          <View style={styles.eventMeta}>
            <MapPin size={13} color={Colors.textSecondary} />
            <Text style={styles.eventMetaText}>{event.location}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push(`/event/${event.id}`)}
        >
          <ArrowUpRight size={13} color={Colors.text} />
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Order card component
  const OrderCard = ({ order }: { order: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderImageContainer}>
        <Image source={order.image} style={styles.orderImage} />
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle}>{order.title}</Text>
        <Text style={styles.orderSubtitle}>{order.subtitle}</Text>
      </View>
      <View style={styles.orderPrice}>
        <Text style={styles.orderPriceText}>{order.price}</Text>
      </View>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor={Colors.text}
          />
        }
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
        <SectionHeader title="Upcoming Events" showSeeAll />
        {mockEvents.length === 0 ? (
          <EmptyState message="No upcoming events" />
        ) : (
          mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}

        {/* Available Events */}
        <SectionHeader title="Available Events" showSeeAll />
        {mockEvents.length === 0 ? (
          <EmptyState message="No events available" />
        ) : (
          mockEvents.map((event) => (
            <EventCard key={`available-${event.id}`} event={event} />
          ))
        )}

        {/* Booked Events */}
        <SectionHeader title="Booked Events" showSeeAll />
        {mockEvents.length === 0 ? (
          <EmptyState message="No booked events" />
        ) : (
          mockEvents.map((event) => (
            <EventCard key={`booked-${event.id}`} event={event} />
          ))
        )}

        {/* Orders */}
        <SectionHeader title="Orders" showSeeAll />
        {mockOrders.length === 0 ? (
          <EmptyState message="No orders yet" />
        ) : (
          mockOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
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
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    minHeight: 140,
  },
  eventImage: {
    width: 120,
    height: '100%',
    borderRadius: 12,
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  eventTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  eventSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventMetaText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  detailsButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
  },
  orderImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  orderSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  orderPrice: {
    alignItems: 'flex-end',
  },
  orderPriceText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
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
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
});
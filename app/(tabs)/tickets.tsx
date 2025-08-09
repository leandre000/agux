import React, { useEffect, useState } from "react";
import { Text, ScrollView, RefreshControl, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import Header from "@/components/Header";
import { TicketsAPI } from "@/lib/api";

export default function EventTicketsScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock tickets data for demonstration with realistic pricing
  const mockTickets = [
    {
      id: '1',
      title: 'Baba Experience',
      category: 'VVIP Tickets',
      quantity: 2,
      price: '25,000 RWF',
      image: require('@/assets/images/m1.png'),
      status: 'active',
    },
    {
      id: '2',
      title: 'Music Festival',
      category: 'VIP Tickets',
      quantity: 1,
      price: '8,000 RWF',
      image: require('@/assets/images/m2.png'),
      status: 'active',
    },
    {
      id: '3',
      title: 'Comedy Night',
      category: 'Regular Tickets',
      quantity: 3,
      price: '3,000 RWF',
      image: require('@/assets/images/m1.png'),
      status: 'active',
    },
    {
      id: '4',
      title: 'Art Exhibition',
      category: 'Premium Tickets',
      quantity: 1,
      price: '15,000 RWF',
      image: require('@/assets/images/m2.png'),
      status: 'active',
    },
    {
      id: '5',
      title: 'Sports Event',
      category: 'VIP Tickets',
      quantity: 2,
      price: '8,000 RWF',
      image: require('@/assets/images/m1.png'),
      status: 'active',
    },
  ];

  async function load() {
    try {
      setError(null);
      // Replace with actual API call when backend is ready
      // const data = await TicketsAPI.getMyTickets();
      setTickets(mockTickets);
    } catch (e: any) {
      setError(e?.message || "Failed to load your tickets");
      setTickets(mockTickets); // Fallback to mock data
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Ticket card component
  const TicketCard = ({ ticket }: { ticket: any }) => (
    <View style={styles.ticketCard}>
      <Image source={ticket.image} style={styles.ticketImage} />
      <View style={styles.ticketOverlay}>
        <Text style={styles.ticketTitle}>{ticket.title}</Text>
        <Text style={styles.ticketCategory}>{ticket.category}</Text>
        <Text style={styles.ticketPrice}>{ticket.price}</Text>
        <TouchableOpacity 
          style={styles.viewTicketButton}
          onPress={() => router.push(`/event/${ticket.id}/ticket-preview`)}
        >
          <Text style={styles.viewTicketText}>View Ticket</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{ticket.quantity}</Text>
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
        onSearchPress={() => {}}
      />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Event Tickets</Text>
          <TouchableOpacity>
            <Text style={styles.recentText}>Recent</Text>
          </TouchableOpacity>
        </View>

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
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {tickets.length === 0 ? (
            <EmptyState message="No tickets found" />
          ) : (
            tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ticketCard: {
    position: 'relative',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    height: 200,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  ticketOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  ticketTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  ticketCategory: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  ticketPrice: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: 12,
  },
  viewTicketButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  viewTicketText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  quantityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 64,
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
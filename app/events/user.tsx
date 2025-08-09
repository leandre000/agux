import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventsStore } from '@/store/events-store';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { StatusBar } from 'expo-status-bar';

export default function AllEventsScreen() {
  const router = useRouter();
  const { userEvents } = useEventsStore();
  
  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'booked'>('all');

  // Mock data for demonstration (since backend not connected yet)
  const mockEvents = [
    {
      id: '1',
      title: 'Baba Experience',
      category: 'Vvip Tickets',
      price: '8,000 RWF',
      quantity: 2,
      image: require('@/assets/images/m1.png'),
      booked: false,
    },
    {
      id: '2', 
      title: 'Baba Experience',
      category: 'Vvip Tickets', 
      price: '8,000 RWF',
      quantity: 2,
      image: require('@/assets/images/m2.png'),
      booked: false,
    },
    {
      id: '3',
      title: 'Baba Experience', 
      category: 'Vvip Tickets',
      price: '8,000 RWF', 
      quantity: 2,
      image: require('@/assets/images/m1.png'),
      booked: false,
    },
    {
      id: '4',
      title: 'Baba Experience',
      category: 'Vvip Tickets',
      price: '8,000 RWF',
      quantity: 2, 
      image: require('@/assets/images/m2.png'),
      booked: false,
    },
    {
      id: '5',
      title: 'Baba Experience',
      category: 'Vvip Tickets',
      price: '8,000 RWF',
      quantity: 2,
      image: require('@/assets/images/m1.png'),
      booked: false,
    },
  ];

  // Use mock data or backend data
  const eventsData = userEvents.length > 0 ? userEvents : mockEvents;
  
  // Filter logic
  const allEvents = eventsData;
  const bookedEvents = eventsData.filter(e => e.booked);
  const eventsToShow = selectedFilter === 'all' ? allEvents : bookedEvents;

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Event card component matching the design
  const EventCard = ({ event }: { event: any }) => (
    <View style={styles.eventCard}>
      <Image 
        source={typeof event.image === 'string' ? { uri: event.image } : event.image} 
        style={styles.eventImage} 
      />
      <View style={styles.eventOverlay}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventCategory}>{event.category || 'Vvip Tickets'}</Text>
        <Text style={styles.eventPrice}>{event.price || '8,000 RWF'}</Text>
        <TouchableOpacity 
          style={styles.viewTicketButton}
          onPress={() => router.push(`/event/${event.id}`)}
        >
          <Text style={styles.viewTicketText}>View Ticket</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{event.quantity || 2}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => router.push("/search")}
      />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Available Events</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
              All Events ({allEvents.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'booked' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('booked')}
          >
            <Text style={[styles.filterButtonText, selectedFilter === 'booked' && styles.filterButtonTextActive]}>
              Booked Events ({bookedEvents.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {eventsToShow.length === 0 ? (
            <EmptyState 
              message={selectedFilter === 'all' 
                ? "No events available at the moment" 
                : "You haven't booked any events yet"
              } 
            />
          ) : (
            eventsToShow.map((event) => (
              <EventCard key={event.id} event={event} />
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
    marginBottom: 16,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  eventCard: {
    position: 'relative',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    height: 200,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  eventTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  eventCategory: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  eventPrice: {
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
});
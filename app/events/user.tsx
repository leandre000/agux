import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventsStore } from '@/store/events-store';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function AllEventsScreen() {
  const router = useRouter();
  const { userEvents } = useEventsStore();
  
  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'booked'>('all');

  // Filtered events
  const allEvents = userEvents;
  const bookedEvents = userEvents.filter(e => e.booked);
  const eventsToShow = selectedFilter === 'all' ? allEvents : bookedEvents;

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Custom event card for All Events to match design
  const AllEventCard = ({ event, isBooked }: { event: any, isBooked?: boolean }) => (
    <View style={styles.listEventCard}>
      <Image 
        source={typeof event.image === 'string' ? { uri: event.image } : event.image} 
        style={styles.listEventImage} 
      />
      <View style={styles.listEventInfo}>
        <View>
          <Text style={styles.listEventTitle} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.listEventSubtitle}>Platini</Text>
          <View style={styles.listEventMeta}>
            <Calendar size={13} color={Colors.textSecondary} />
            <Text style={styles.listEventMetaText}>{event.date}</Text>
          </View>
          <View style={styles.listEventMeta}>
            <MapPin size={13} color={Colors.textSecondary} />
            <Text style={styles.listEventMetaText}>{event.location}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.listDetailsButton} 
          onPress={() => router.push(`/event/${event.id}`)}
        >
          <ArrowUpRight size={13} color={Colors.text} />
          <Text style={styles.listDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header title="Available Events" showBack />
      
      <View style={styles.tabsRowCentered}>
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
            <AllEventCard 
              key={event.id} 
              event={event} 
              isBooked={selectedFilter === 'booked'} 
            />
          ))
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
  tabsRowCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
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
    paddingBottom: 32,
  },
  listEventCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    minHeight: 140,
  },
  listEventImage: {
    width: 120,
    height: '100%',
    borderRadius: 12,
    marginRight: 16,
  },
  listEventInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  listEventTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  listEventSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  listEventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listEventMetaText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
  listDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  listDetailsButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyState: {
    paddingHorizontal: 20,
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
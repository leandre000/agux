import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventsStore } from '@/store/events-store';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react-native';
import { Event, EventCategory } from '@/mocks/events';

// Mock data for all events (fallback)
export const allEventsMock: Event[] = [
  {
    id: 'a1',
    title: 'Baba Xpreince',
    date: '10-May-2025',
    location: 'Serena Hotel Kigali',
    image: require('../../assets/images/m1.png'),
    category: 'Music' as EventCategory,
    price: 'Standard',
    description: 'Live concert event.',
    isFeatured: false,
    booked: true,
  },
  {
    id: 'a2',
    title: 'Baba Xpreince',
    date: '10-May-2025',
    location: 'Serena Hotel Kigali',
    image: require('../../assets/images/m2.png'),
    category: 'Music' as EventCategory,
    price: 'Standard',
    description: 'Live concert event.',
    isFeatured: false,
    booked: false,
  },
  {
    id: 'a3',
    title: 'Baba Xpreince',
    date: '10-May-2025',
    location: 'Serena Hotel Kigali',
    image: require('../../assets/images/m1.png'),
    category: 'Music' as EventCategory,
    price: 'Standard',
    description: 'Live concert event.',
    isFeatured: false,
    booked: true,
  },
];

export default function AllEventsScreen() {
  const router = useRouter();
  let { userEvents } = useEventsStore();
  if (userEvents.length < 3) userEvents = allEventsMock;

  // Filter state
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'booked'>('all');

  // Filtered events
  const allEvents = userEvents;
  const bookedEvents = userEvents.filter(e => e.booked);
  const eventsToShow = selectedFilter === 'all' ? allEvents : bookedEvents;

  // Custom event card for All Events to match design
  const AllEventCard = ({ event, isBooked }: { event: Event, isBooked?: boolean }) => (
    <View style={styles.listEventCard}>
      <Image source={typeof event.image === 'string' ? { uri: event.image } : event.image} style={styles.listEventImage} />
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
        <TouchableOpacity style={styles.listDetailsButton} onPress={() => router.push({ pathname: `/event/${event.id}`, params: { booked: isBooked ? '1' : undefined } })}>
          <ArrowUpRight size={13} color={Colors.text} />
          <Text style={styles.listDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {eventsToShow.slice(0, 3).map((event) => (
          <AllEventCard key={event.id} event={event} isBooked={selectedFilter === 'booked'} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsScroll: {
    maxHeight: 60,
    marginBottom: 4,
    marginTop: 8,
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  filterRow: {
    display: 'none', // replaced by tabsScroll
  },
  filterButton: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 26,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterButtonTextActive: {
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 14,
    minWidth: 80,
    maxWidth: 80,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  eventTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  eventSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventMetaText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    marginLeft: 10,
    minHeight: 44,
    minWidth: 44,
  },
  detailsButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listEventCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    height: 200,
  },
  listEventImage: {
    width: 200,
    height: '100%',
    borderRadius: 16,
    marginRight: 19,
  },
  listEventInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  listEventTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 17,
  },
  listEventSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  listEventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  listEventMetaText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginLeft: 9,
  },
  listDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingVertical: 7,
  },
  listDetailsButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  tabsRowCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
});

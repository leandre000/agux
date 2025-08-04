import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Event, EventCategory } from '@/mocks/events';
import EventCard from '@/components/EventCard';

const recentEvents: Event[] = [
  {
    id: 'r1',
    title: 'Recent Event 1',
    date: '12-May-2025',
    location: 'Kigali Arena',
    image: require('@/assets/images/m1.png'),
    category: 'Music' as EventCategory,
    price: 'Standard',
    description: 'A recent music event.',
    isFeatured: false,
  },
  {
    id: 'r2',
    title: 'Recent Event 2',
    date: '15-May-2025',
    location: 'Serena Hotel',
    image: require('@/assets/images/m2.png'),
    category: 'Art' as EventCategory,
    price: 'VIP',
    description: 'A recent art event.',
    isFeatured: false,
  },
];

export default function TicketsTabScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#18181A' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Recent Events</Text>
      {recentEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  );
}

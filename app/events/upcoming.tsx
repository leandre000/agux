import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventsStore } from '@/store/events-store';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const { allEvents } = useEventsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Upcoming Events" showBack />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {allEvents.map((event) => (
          <TouchableOpacity 
            key={event.id}
            onPress={() => router.push(`/event/${event.id}`)}
          >
            <EventCard event={event} />
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
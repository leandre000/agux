import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useEventsStore } from '@/store/events-store';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  const router = useRouter();
  const { allEvents, fetchAll } = useEventsStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      await fetchAll();
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }, [fetchAll]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSearch = useCallback(() => {
    // Navigate to search results or filter events
    router.push("/(tabs)");
  }, [router]);

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, {user?.username || 'User'}!</Text>
        <Text style={styles.subtitle}>Discover amazing events happening around you</Text>
      </View>

      <SearchBar
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearchPress={handleSearch}
      />

      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <TouchableOpacity onPress={() => router.push('/events/user')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredEvents.slice(0, 5)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <Button
          title="View All Events"
          onPress={() => router.push('/events/user')}
          style={styles.viewAllButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  seeAllText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
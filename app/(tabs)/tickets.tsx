import Colors from '@/constants/Colors';
import { useTicketsStore } from '@/store/tickets-store';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketsScreen() {
  const router = useRouter();
  const { userTickets, fetchUserTickets } = useTicketsStore();
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      await fetchUserTickets();
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }, [fetchUserTickets]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleTicketPress = (ticketId: string) => {
    router.push('/profile/settings');
  };

  const renderTicket = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => handleTicketPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketIcon}>
          <Ticket size={24} color={Colors.primary} />
        </View>
        <View style={styles.ticketInfo}>
          <Text style={styles.eventTitle}>{item.eventTitle}</Text>
          <Text style={styles.ticketType}>{item.ticketType}</Text>
        </View>
        <View style={styles.ticketStatus}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? Colors.success : Colors.warning }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.eventDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.eventTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.eventLocation}</Text>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <Text style={styles.ticketId}>Ticket ID: {item.id}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (userTickets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ticket size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>No Tickets Yet</Text>
          <Text style={styles.emptyStateText}>
            You haven&apos;t purchased any tickets yet. Start exploring events to get your first ticket!
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/events/user')}
          >
            <Text style={styles.exploreButtonText}>Explore Events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <Text style={styles.subtitle}>Manage your event tickets</Text>
      </View>

      <FlatList
        data={userTickets}
        keyExtractor={(item) => String(item.id || item.ticket_id || Math.random())}
        renderItem={renderTicket}
        contentContainerStyle={styles.ticketList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    paddingBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  ticketList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ticketCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    height: 150,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  ticketIcon: {
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  eventTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketType: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  ticketStatus: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketDetails: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  ticketId: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  price: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  exploreButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
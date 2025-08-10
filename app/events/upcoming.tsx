import DatabaseError from "@/components/DatabaseError";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isDatabaseError } from "@/lib/errorHandler";

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const { allEvents, fetchAll, loading, error } = useEventsStore();

  React.useEffect(() => {
    // Load events on mount
    fetchAll().catch(() => void 0);
  }, [fetchAll]);

  const handleRetry = () => {
    fetchAll().catch(() => void 0);
  };

  // Show database error if there's a database-related error
  if (error && isDatabaseError({ message: error })) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <DatabaseError 
          error={error}
          onRetry={handleRetry}
          showRetry={true}
        />
      </SafeAreaView>
    );
  }

  // Show generic error for other types of errors
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Events</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Upcoming Events" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading
          ? null
          : allEvents.map((event) => {
              const cardEvent = {
                id: event.id,
                title: event.title,
                location: event.location,
                image:
                  event.image ??
                  (event.imageUrl ? { uri: event.imageUrl } : undefined),
                price: event.price ?? 0,
                booked: event.booked ?? false,
                category: event.category,
                date: event.date,
              } as any;

              return (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <EventCard event={cardEvent} />
                </TouchableOpacity>
              );
            })}
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
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

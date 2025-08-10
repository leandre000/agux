import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const { allEvents, fetchAll, loading } = useEventsStore();

  React.useEffect(() => {
    // Load events on mount
    fetchAll().catch(() => void 0);
  }, [fetchAll]);

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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

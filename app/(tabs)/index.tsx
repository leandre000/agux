import Carousel from "@/components/Carousel";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListEventCard from "@/components/ListEventCard";

export default function HomeScreen() {
  const router = useRouter();
  const { featuredEvents, userEvents } = useEventsStore();

  // Partition featured and remaining as available/booked without mocks
  const availableEvents = userEvents.slice(0, 1);
  const bookedEvents = userEvents.slice(1, 3);

  const handleSeeAllUpcoming = useCallback(() => {
    router.push("/events/upcoming");
  }, [router]);

  const handleSeeAllAvailable = useCallback(() => {
    router.push("/events/user");
  }, [router]);

  const handleSeeAllBooked = useCallback(() => {
    router.push("/events/user");
  }, [router]);

  // moved to a separate component

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => router.push("/search")}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Events */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={handleSeeAllUpcoming}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel>
            {featuredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <EventCard
                  event={
                    {
                      ...event,
                      image:
                        typeof event.image === "string"
                          ? event.image
                          : ((event as any)?.image?.uri as string) ??
                            (require("@/assets/images/m1.png") as unknown as string),
                    } as any
                  }
                  variant="featured"
                />
              </TouchableOpacity>
            ))}
          </Carousel>
        </View>

        {/* Available Events */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Available Events</Text>
          <TouchableOpacity onPress={handleSeeAllAvailable}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {availableEvents.map((event) => (
          <ListEventCard key={`available-${event.id}`} event={event} />
        ))}

        {/* Booked Events */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Booked Events</Text>
          <TouchableOpacity onPress={handleSeeAllBooked}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {bookedEvents.map((event) => (
          <ListEventCard key={`booked-${event.id}`} event={event} isBooked />
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
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  carouselContainer: {
    marginBottom: 24,
    marginLeft: 10,
  },
});

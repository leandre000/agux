import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { RefreshCw, AlertTriangle, Calendar, MapPin, Users, Star } from "lucide-react-native";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { isDatabaseError } from "@/lib/errorHandler";

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const { allEvents, fetchAll, loading, error } = useEventsStore();

  React.useEffect(() => {
    fetchAll().catch(() => void 0);
  }, [fetchAll]);

  const handleRetry = () => {
    fetchAll().catch(() => void 0);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  // Show database error if there's a database-related error
  if (error && isDatabaseError({ message: error })) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <AlertTriangle size={48} color={Colors.primary} />
          </View>
          <Text style={styles.errorTitle}>Database Error</Text>
          <Text style={styles.errorMessage}>
            We're experiencing a technical issue with our database. Our team has been notified and is working to fix it.
          </Text>
          <Button
            title="Try Again"
            variant="primary"
            icon={RefreshCw}
            onPress={handleRetry}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Show generic error for other types of errors
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <AlertTriangle size={48} color={Colors.primary} />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Events</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Try Again"
            variant="primary"
            icon={RefreshCw}
            onPress={handleRetry}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Filter upcoming events (events with future dates)
  const upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate > now;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Upcoming Events" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Calendar size={32} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
          <Text style={styles.headerSubtitle}>
            {upcomingEvents.length} events coming up
          </Text>
        </View>

        {/* Events List */}
        {upcomingEvents.length > 0 ? (
          <View style={styles.eventsSection}>
            {upcomingEvents.map((event, index) => (
              <View key={event.id} style={styles.eventContainer}>
                <EventCard
                  event={event}
                  variant="compact"
                  onPress={() => handleEventPress(event.id)}
                />
                {index < upcomingEvents.length - 1 && (
                  <View style={styles.eventSeparator} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Calendar size={48} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No Upcoming Events</Text>
            <Text style={styles.emptyMessage}>
              There are no upcoming events scheduled at the moment. Check back later for new events!
            </Text>
            <Button
              title="Browse All Events"
              variant="outline"
              onPress={() => router.push("/(tabs)/events-user")}
              style={styles.browseButton}
            />
          </View>
        )}

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Button
            title="View All Events"
            variant="primary"
            size="large"
            fullWidth={true}
            onPress={() => router.push("/(tabs)/events-user")}
          />
        </View>
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
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  eventContainer: {
    marginBottom: 16,
  },
  eventSeparator: {
    height: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    minWidth: 160,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  retryButton: {
    minWidth: 120,
  },
});

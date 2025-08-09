import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, ChevronLeft, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const TICKETS = [
  { type: "Regular Tickets", price: "5000 Rwf", left: 100 },
  { type: "Regular Tickets", price: "5000 Rwf", left: 100 },
  { type: "Regular Tickets", price: "5000 Rwf", left: 100 },
  { type: "Regular Tickets", price: "5000 Rwf", left: 100 },
];

export const options = {
  headerShown: false,
};

export default function EventDetailScreen() {
  const { id, booked } = useLocalSearchParams<{
    id: string;
    booked?: string;
  }>();
  const router = useRouter();

  // Mock event data (will be replaced with backend data)
  const [event, setEvent] = useState<any>(null);
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: -1.9536,
    longitude: 30.0605,
  });
  const [loadingCoords, setLoadingCoords] = useState(false);

  useEffect(() => {
    // Mock event data - replace with actual backend call
    const mockEvent = {
      id: id,
      title: "Baba Experience",
      image: require("@/assets/images/m1.png"),
      organizer: "Platini",
      date: "15-May-2025",
      venue: "Serena Hotel Kigali",
      description: "Amazing music experience with Baba",
      booked: false,
    };
    setEvent(mockEvent);

    // Set coordinates for Serena Hotel Kigali
    setCoords({
      latitude: -1.9536,
      longitude: 30.0605,
    });
  }, [id]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{event.title}</Text>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          <RNImage
            source={event.image}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          {/* Organizer */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Organizer</Text>
            <Text style={styles.detailValue}>{event.organizer}</Text>
          </View>

          {/* Date */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <View style={styles.detailValueRow}>
              <Calendar size={16} color={Colors.text} />
              <Text style={styles.detailValue}>{event.date}</Text>
            </View>
          </View>

          {/* Venue */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Venue</Text>
            <View style={styles.detailValueRow}>
              <MapPin size={16} color={Colors.text} />
              <Text style={styles.detailValue}>{event.venue}</Text>
            </View>
          </View>
        </View>

        {/* Tickets Section */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Tickets</Text>
          <View style={styles.ticketsGrid}>
            {TICKETS.map((ticket, idx) => (
              <View style={styles.ticketCard} key={idx}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketType}>{ticket.type}</Text>
                  <Text style={styles.ticketLeft}>100 left</Text>
                </View>
                <Text style={styles.ticketPrice}>{ticket.price}</Text>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => router.push(`/event/${id}/seat-selection`)}
                >
                  <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/event/${id}/map`)}
            >
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: coords.latitude || -1.9536,
                  longitude: coords.longitude || 30.0605,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                {coords.latitude && coords.longitude && (
                  <Marker
                    coordinate={{
                      latitude: coords.latitude,
                      longitude: coords.longitude,
                    }}
                    title={event.venue}
                    description={event.title}
                    pinColor={Colors.primary}
                  />
                )}
              </MapView>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ticketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketType: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  ticketLeft: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  ticketPrice: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: Colors.text,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  locationSection: {
    paddingHorizontal: 20,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
import Header from "@/components/Header";
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

const TICKETS = [
  { type: "Regular Tickets", price: "5000 Rwf", left: 100 },
  { type: "Vip Tickets", price: "5000 Rwf", left: 100 },
  { type: "Vvip Tickets", price: "5000 Rwf", left: 100 },
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

  // Replace mock with backend-driven load via events store
  const [event, setEvent] = useState<any>(null);
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [loadingCoords, setLoadingCoords] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const mod = await import("@/store/events-store");
        const ev = await mod.useEventsStore.getState().fetchById(String(id));
        if (isMounted) {
          const fallback = {
            title: "Event",
            image: require("@/assets/images/m2.png"),
            organizer: ev?.organizer || "Organizer",
            date: ev?.date || "TBD",
            venue: ev?.location || "Unknown venue",
            description: ev?.description || "",
            booked: ev?.booked ?? false,
          };
          setEvent({
            ...fallback,
            title: ev?.title ?? fallback.title,
            image:
              ev?.image ??
              (ev?.imageUrl ? { uri: ev.imageUrl } : fallback.image),
            venue: ev?.location ?? fallback.venue,
          });
        }
      } catch {
        // fall back to minimal default
        if (isMounted) {
          setEvent({
            title: "Event",
            image: require("@/assets/images/m2.png"),
            organizer: "Organizer",
            date: "TBD",
            venue: "Unknown venue",
            description: "",
            booked: false,
          });
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Geocode venue name to coordinates
  useEffect(() => {
    async function geocodeVenue() {
      if (!event?.venue) return;
      setLoadingCoords(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            event.venue
          )}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setCoords({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        } else {
          setCoords({ latitude: -1.9536, longitude: 30.0605 }); // fallback
        }
      } catch (e) {
        setCoords({ latitude: -1.9536, longitude: 30.0605 }); // fallback
      }
      setLoadingCoords(false);
    }
    geocodeVenue();
  }, [event?.venue]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header showLogo showProfile showSearch />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header showLogo showProfile showSearch />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back and Title */}
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          <RNImage
            source={event.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Event Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organizer</Text>
            <Text style={styles.infoValue}>{event.organizer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <View style={styles.infoIconRow}>
              <Calendar size={16} color={Colors.text} />
              <Text style={styles.infoValue}>{event.date}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Venue</Text>
            <View style={styles.infoIconRow}>
              <MapPin size={16} color={Colors.text} />
              <Text style={styles.infoValue}>{event.venue}</Text>
            </View>
          </View>
        </View>

        {/* Tickets Grid */}
        <Text style={styles.sectionTitle}>Tickets</Text>
        <View style={styles.ticketsGrid}>
          {(booked ? [TICKETS[0]] : TICKETS).map((ticket, idx) => (
            <View style={styles.ticketCard} key={idx}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketType}>{ticket.type}</Text>
                <Text style={styles.ticketLeft}>100 left</Text>
              </View>
              <Text style={styles.ticketPrice}>{ticket.price}</Text>
              {!booked && !event.booked && (
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => router.push(`/event/${id}/ticket-names?count=1`)}
                >
                  <Text style={styles.buyBtnText}>Buy</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Location Map */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => router.push(`/event/${id}/map`)}
          >
            <MapView
              style={styles.mapImg}
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
                />
              )}
            </MapView>
          </TouchableOpacity>
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
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoFirst: {
    color: Colors.text,
  },
  logoSecond: {
    color: Colors.primary,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  iconImg: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginLeft: 8,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  imageContainer: {
    width: "92%",
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    width: 80,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  infoIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  ticketsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  ticketCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: "48%",
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketType: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 15,
  },
  ticketLeft: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  ticketPrice: {
    color: Colors.text,
    fontSize: 15,
    marginBottom: 10,
  },
  buyBtn: {
    backgroundColor: Colors.text,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 2,
  },
  buyBtnText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
  mapContainer: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  mapImg: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },
});

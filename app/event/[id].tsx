import React, { useEffect, useState } from "react";
import {
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, ChevronLeft, MapPin } from "lucide-react-native";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useEventsStore, Event } from "@/store/events-store";
import { useTicketsStore, TicketCategory } from "@/store/tickets-store";

export const options = {
  headerShown: false,
};

function formatPrice(price: number, currency: string = 'RWF'): string {
  return `${price.toLocaleString()} ${currency}`;
}

export default function EventDetailScreen() {
  const { id, booked } = useLocalSearchParams<{
    id: string;
    booked?: string;
  }>();
  const router = useRouter();
  
  const { fetchById: fetchEvent, loading: eventsLoading, error: eventsError } = useEventsStore();
  const { fetchTicketCategories, ticketCategories, loading: ticketsLoading, error: ticketsError } = useTicketsStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (id) {
      loadEventData();
    }
  }, [id]);

  const loadEventData = async () => {
    if (!id) return;
    
    try {
      // Fetch event details
      const eventData = await fetchEvent(id);
      if (eventData) {
        setEvent(eventData);
        
        // Try to extract coordinates from location
        if (eventData.location) {
          // You can implement geocoding here or expect coordinates from backend
          // For now, using default Rwanda coordinates (Kigali)
          setCoords({
            latitude: -1.9441,
            longitude: 30.0619,
          });
        }
      }
      
      // Fetch ticket categories
      const ticketCats = await fetchTicketCategories(id);
      setCategories(ticketCats);
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load event details");
    }
  };

  const handleBuyTicket = (category: TicketCategory) => {
    if (!category.available_quantity || category.available_quantity <= 0) {
      Alert.alert("Sold Out", "This ticket category is no longer available.");
      return;
    }
    
    // Navigate to seat selection with category info
    router.push(`/event/${id}/seat-selection?categoryId=${category.category_id}&categoryName=${encodeURIComponent(category.name)}&price=${category.price}`);
  };

  const handleViewMap = () => {
    router.push(`/event/${id}/map`);
  };

  if (eventsLoading || ticketsLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <Header showLogo showProfile showSearch />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (eventsError || ticketsError || !event) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <Header showLogo showProfile showSearch />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {eventsError || ticketsError || "Event not found"}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadEventData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
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
            source={
              event.imageUrl 
                ? { uri: event.imageUrl }
                : event.image || require('@/assets/images/m1.png')
            }
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          {/* Description */}
          {event.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{event.description}</Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <View style={styles.detailValueRow}>
              <Calendar size={16} color={Colors.text} />
              <Text style={styles.detailValue}>
                {event.date ? new Date(event.date).toLocaleDateString() : "TBD"}
              </Text>
            </View>
          </View>

          {/* Venue */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Venue</Text>
            <View style={styles.detailValueRow}>
              <MapPin size={16} color={Colors.text} />
              <Text style={styles.detailValue}>{event.location || "TBD"}</Text>
            </View>
          </View>
        </View>

        {/* Tickets Section */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Tickets</Text>
          {categories.length === 0 ? (
            <View style={styles.noTicketsContainer}>
              <Text style={styles.noTicketsText}>No tickets available for this event</Text>
            </View>
          ) : (
            <View style={styles.ticketsGrid}>
              {categories.map((category, idx) => (
                <View style={styles.ticketCard} key={idx}>
                  <Text style={styles.ticketType}>{category.name}</Text>
                  <Text style={styles.ticketPrice}>
                    {formatPrice(category.price, category.currency)}
                  </Text>
                  <Text style={styles.ticketLeft}>
                    {category.available_quantity || 0} left
                  </Text>
                  <TouchableOpacity 
                    style={[
                      styles.buyButton,
                      (!category.available_quantity || category.available_quantity <= 0) && styles.buyButtonDisabled
                    ]}
                    onPress={() => handleBuyTicket(category)}
                    disabled={!category.available_quantity || category.available_quantity <= 0}
                  >
                    <Text style={[
                      styles.buyButtonText,
                      (!category.available_quantity || category.available_quantity <= 0) && styles.buyButtonTextDisabled
                    ]}>
                      {(!category.available_quantity || category.available_quantity <= 0) ? "Sold Out" : "Buy"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Location Section */}
        {coords.latitude && coords.longitude && (
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.mapContainer} onPress={handleViewMap}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  }}
                  title={event.title}
                  description={event.location}
                  pinColor={Colors.primary}
                />
              </MapView>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.text,
    fontSize: 16,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noTicketsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  noTicketsText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  ticketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ticketCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketType: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketPrice: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticketLeft: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  buyButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  buyButtonTextDisabled: {
    color: Colors.background,
  },
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
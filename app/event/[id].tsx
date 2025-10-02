import Header from "@/components/Header";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { Event, useEventsStore } from "@/store/events-store";
import { TicketCategory, useTicketsStore } from "@/store/tickets-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Bell, Calendar, ChevronLeft, MapPin, Search, User } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, radius } from "@/constants/spacing";
import { typeScale } from "@/constants/typography";

export const options = {
  headerShown: false,
};

function formatPrice(price: number, currency: string = 'RWF'): string {
  return `${price.toLocaleString()} ${currency}`;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();
  
  const { fetchById: fetchEvent, loading: eventsLoading, error: eventsError } = useEventsStore();
  const { fetchTicketCategories, loading: ticketsLoading, error: ticketsError } = useTicketsStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: -1.9441,
    longitude: 30.0619,
  });

  const loadEventData = useCallback(async () => {
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
  }, [id, fetchEvent, fetchTicketCategories]);

  useEffect(() => {
    if (id) {
      loadEventData();
    }
  }, [id, loadEventData]);

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
        <View style={{ padding: 20, gap: 16 }}>
          <Skeleton height={220} radius={16} />
          <Skeleton height={28} radius={8} />
          <Skeleton height={20} radius={8} />
          <Skeleton height={120} radius={12} />
          <Skeleton height={44} radius={22} />
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
      
      {/* Custom Header matching the design */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{event.title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

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

        {/* Event Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organizer:</Text>
            <Text style={styles.infoValue}>Platini</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconRow}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.infoLabel}>Date:</Text>
            </View>
            <Text style={styles.infoValue}>
              {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "TBD"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconRow}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.infoLabel}>Venue:</Text>
            </View>
            <Text style={styles.infoValue}>{event.location || "Serena Hotel Kigali"}</Text>
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
                  <View style={styles.ticketBadge}>
                    <Text style={styles.ticketBadgeText}>
                      {category.available_quantity || 0} left
                    </Text>
                  </View>
                  <Text style={styles.ticketPrice}>
                    {formatPrice(category.price, category.currency)}
                  </Text>
                  <TouchableOpacity 
                    style={[
                      styles.buyButton,
                      (!category.available_quantity || category.available_quantity <= 0) && styles.buyButtonDisabled
                    ]}
                    onPress={() => handleBuyTicket(category)}
                    disabled={!category.available_quantity || category.available_quantity <= 0}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: typeScale.h3.size,
    fontWeight: typeScale.h3.weight,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: typeScale.caption.size,
    marginRight: 8,
  },
  infoValue: {
    color: Colors.text,
    fontSize: typeScale.body.size,
    fontWeight: '500',
  },
  infoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: typeScale.caption.size,
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.text,
    fontSize: typeScale.body.size,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsSection: {
    paddingHorizontal: 20,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: typeScale.h3.size,
    fontWeight: typeScale.h3.weight,
    marginBottom: spacing.md,
  },
  noTicketsContainer: {
    backgroundColor: Colors.card,
    borderRadius: radius.lg,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
  ticketBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ticketBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  ticketPrice: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
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
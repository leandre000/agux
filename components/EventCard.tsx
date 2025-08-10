import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Calendar, MapPin, Star, Clock, Users } from "lucide-react-native";
import Colors from "@/constants/Colors";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    location?: string;
    image?: any;
    price?: number;
    booked?: boolean;
    category?: string;
    date?: string;
    time?: string;
    attendees?: number;
    rating?: number;
  };
  onPress?: () => void;
  variant?: "default" | "featured" | "compact";
}

export default function EventCard({ 
  event, 
  onPress, 
  variant = "default" 
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      music: "#e6007e",
      sports: "#3b82f6",
      food: "#f59e0b",
      tech: "#10b981",
      art: "#8b5cf6",
      business: "#6b7280",
    };
    return colors[category?.toLowerCase()] || Colors.primary;
  };

  if (variant === "compact") {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={event.image} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.compactMeta}>
            <View style={styles.compactMetaItem}>
              <Calendar size={14} color={Colors.textSecondary} />
              <Text style={styles.compactMetaText}>
                {formatDate(event.date || "")}
              </Text>
            </View>
            {event.location && (
              <View style={styles.compactMetaItem}>
                <MapPin size={14} color={Colors.textSecondary} />
                <Text style={styles.compactMetaText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        variant === "featured" && styles.featuredCard
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={event.image} style={styles.image} />
        {variant === "featured" && (
          <View style={styles.featuredBadge}>
            <Star size={16} color="#ffffff" fill="#ffffff" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        {event.category && (
          <View style={[
            styles.categoryBadge, 
            { backgroundColor: getCategoryColor(event.category) }
          ]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        )}
        {event.booked && (
          <View style={styles.bookedBadge}>
            <Text style={styles.bookedText}>Booked</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={18} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatDate(event.date || "")}
            </Text>
          </View>
          
          {event.time && (
            <View style={styles.metaItem}>
              <Clock size={18} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {formatTime(event.date || "")}
              </Text>
            </View>
          )}
          
          {event.location && (
            <View style={styles.metaItem}>
              <MapPin size={18} color={Colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          )}
          
          {event.attendees && (
            <View style={styles.metaItem}>
              <Users size={18} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {event.attendees} attending
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {event.price !== undefined && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.price}>
                ${event.price === 0 ? "Free" : event.price}
              </Text>
            </View>
          )}
          
          {event.rating && (
            <View style={styles.ratingContainer}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.rating}>{event.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  compactCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  featuredText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  bookedBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookedText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  compactContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  metaContainer: {
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  compactMeta: {
    gap: 8,
  },
  compactMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  compactMetaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});
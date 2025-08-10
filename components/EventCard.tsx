import Colors from "@/constants/Colors";
import { Bookmark, Calendar, Clock, Heart, MapPin, Share2, Star, Users } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

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
    description?: string;
    organizer?: string;
  };
  onPress?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  variant?: "default" | "featured" | "compact" | "detailed";
  loading?: boolean;
  isFavorite?: boolean;
  isBookmarked?: boolean;
}

const { width } = Dimensions.get('window');

export default function EventCard({ 
  event, 
  onPress, 
  onFavorite,
  onShare,
  onBookmark,
  variant = "default",
  loading = false,
  isFavorite = false,
  isBookmarked = false
}: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!loading) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
      entertainment: "#ec4899",
      education: "#06b6d4",
    };
    return colors[category?.toLowerCase()] || Colors.primary;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      music: "🎵",
      sports: "⚽",
      food: "🍕",
      tech: "💻",
      art: "🎨",
      business: "💼",
      entertainment: "🎭",
      education: "📚",
    };
    return icons[category?.toLowerCase()] || "🎪";
  };

  if (loading) {
    return <EventCardSkeleton variant={variant} />;
  }

  if (variant === "compact") {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <TouchableOpacity 
          style={styles.compactCard} 
          onPress={onPress} 
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === "detailed") {
    return (
      <Animated.View style={[styles.detailedCard, { opacity: opacityAnim }]}>
        <TouchableOpacity 
          style={styles.detailedCardTouchable} 
          onPress={onPress} 
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.detailedImageContainer}>
              <Image 
                source={event.image} 
                style={styles.detailedImage}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && !imageError && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator color={Colors.primary} />
                </View>
              )}
              {imageError && (
                <View style={styles.imageErrorContainer}>
                  <Text style={styles.imageErrorText}>Image unavailable</Text>
                </View>
              )}
              
              {/* Category Badge */}
              {event.category && (
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                  <Text style={styles.categoryBadgeText}>
                    {getCategoryIcon(event.category)} {event.category}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                {onFavorite && (
                  <TouchableOpacity 
                    style={[styles.actionButton, isFavorite && styles.actionButtonActive]} 
                    onPress={onFavorite}
                  >
                    <Heart 
                      size={18} 
                      color={isFavorite ? Colors.primary : Colors.text} 
                      fill={isFavorite ? Colors.primary : 'transparent'} 
                    />
                  </TouchableOpacity>
                )}
                {onShare && (
                  <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                    <Share2 size={18} color={Colors.text} />
                  </TouchableOpacity>
                )}
                {onBookmark && (
                  <TouchableOpacity 
                    style={[styles.actionButton, isBookmarked && styles.actionButtonActive]} 
                    onPress={onBookmark}
                  >
                    <Bookmark 
                      size={18} 
                      color={isBookmarked ? Colors.primary : Colors.text} 
                      fill={isBookmarked ? Colors.primary : 'transparent'} 
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Price Badge */}
              {event.price !== undefined && (
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.detailedContent}>
              <View style={styles.detailedHeader}>
                <Text style={styles.detailedTitle} numberOfLines={2}>
                  {event.title}
                </Text>
              </View>

              {event.description && (
                <Text style={styles.detailedDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              )}

              <View style={styles.detailedMeta}>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>
                      {formatDate(event.date || "")}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>
                      {formatTime(event.date || "")}
                    </Text>
                  </View>
                </View>

                {event.location && (
                  <View style={styles.metaItem}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                )}

                {event.organizer && (
                  <View style={styles.metaItem}>
                    <Users size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {event.organizer}
                    </Text>
                  </View>
                )}

                <View style={styles.bottomMeta}>
                  {event.attendees && (
                    <View style={styles.attendeesContainer}>
                      <Users size={14} color={Colors.textSecondary} />
                      <Text style={styles.attendeesText}>
                        {event.attendees} attending
                      </Text>
                    </View>
                  )}
                  
                  {event.rating && (
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>
                        {event.rating}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: opacityAnim }]}>
      <TouchableOpacity 
        style={[
          styles.cardTouchable, 
          variant === "featured" && styles.featuredCard
        ]} 
        onPress={onPress}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.imageContainer}>
            <Image 
              source={event.image} 
              style={styles.image}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && !imageError && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            )}
            {imageError && (
              <View style={styles.imageErrorContainer}>
                <Text style={styles.imageErrorText}>Image unavailable</Text>
              </View>
            )}
            
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
                <Text style={styles.categoryText}>
                  {getCategoryIcon(event.category)} {event.category}
                </Text>
              </View>
            )}
            
            {event.booked && (
              <View style={styles.bookedBadge}>
                <Text style={styles.bookedText}>Booked</Text>
              </View>
            )}

            {/* Action Buttons for default variant */}
            <View style={styles.defaultActionButtons}>
              {onFavorite && (
                <TouchableOpacity 
                  style={[styles.defaultActionButton, isFavorite && styles.defaultActionButtonActive]} 
                  onPress={onFavorite}
                >
                  <Heart 
                    size={16} 
                    color={isFavorite ? Colors.primary : Colors.text} 
                    fill={isFavorite ? Colors.primary : 'transparent'} 
                  />
                </TouchableOpacity>
              )}
            </View>
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
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Skeleton Loading Component
function EventCardSkeleton({ variant }: { variant: string }) {
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonMeta}>
          <View style={styles.skeletonMetaItem} />
          <View style={styles.skeletonMetaItem} />
        </View>
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonFooterItem} />
          <View style={styles.skeletonFooterItem} />
        </View>
      </View>
    </View>
  );

  if (variant === "compact") {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactImage} />
        <View style={styles.compactContent}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonMeta}>
            <View style={styles.skeletonMetaItem} />
            <View style={styles.skeletonMetaItem} />
          </View>
        </View>
      </View>
    );
  }

  return renderSkeleton();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardTouchable: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorText: {
    color: Colors.textSecondary,
    fontSize: 14,
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
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: Colors.border,
  },
  compactContent: {
    flex: 1,
    justifyContent: "center",
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  compactMeta: {
    gap: 8,
  },
  compactMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactMetaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    flex: 1,
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
  categoryBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
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
  defaultActionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  defaultActionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultActionButtonActive: {
    backgroundColor: Colors.primary + '80',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 24,
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
  metaText: {
    fontSize: 14,
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

  // Detailed variant styles
  detailedCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  detailedCardTouchable: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: 'hidden',
  },
  detailedImageContainer: {
    position: 'relative',
    height: 250,
  },
  detailedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: Colors.primary + '80',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceBadgeText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  detailedContent: {
    padding: 20,
  },
  detailedHeader: {
    marginBottom: 12,
  },
  detailedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 28,
  },
  detailedDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailedMeta: {
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeesText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Skeleton styles
  skeletonContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  skeletonImage: {
    height: 200,
    backgroundColor: Colors.border,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 12,
    width: '80%',
  },
  skeletonMeta: {
    gap: 8,
    marginBottom: 12,
  },
  skeletonMetaItem: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 4,
    width: '60%',
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonFooterItem: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 4,
    width: '30%',
  },
});
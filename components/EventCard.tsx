import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Event } from '@/store/events-store';

interface EventCardProps {
  event: Event;
  variant?: 'featured' | 'list';
}

const { width } = Dimensions.get('window');

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'list' }) => {
  const isFeatured = variant === 'featured';

  return (
    <View style={[
      styles.container,
      isFeatured ? styles.featuredContainer : styles.listContainer
    ]}>
      <Image
        source={
          event.imageUrl 
            ? { uri: event.imageUrl }
            : event.image || require('@/assets/images/m1.png')
        }
        style={[
          styles.image,
          isFeatured ? styles.featuredImage : styles.listImage
        ]}
        contentFit="cover"
        transition={300}
      />
      
      {isFeatured ? (
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{event.title}</Text>
          <View style={styles.featuredDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.text} />
              <Text style={styles.detailText}>{event.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.text} />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.listContent}>
          <View style={styles.listTextContent}>
            <Text style={styles.listTitle}>{event.title}</Text>
            <Text style={styles.priceText}>{event.price}</Text>
            <View style={styles.detailRow}>
              <Calendar size={14} color={Colors.textSecondary} />
              <Text style={styles.listDetailText}>{event.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.listDetailText}>{event.location}</Text>
            </View>
          </View>
          
          <Link href={`/event/${event.id}`} asChild>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <ArrowUpRight size={18} color={Colors.text} />
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  featuredContainer: {
    width: width - 40,
    height: 220,
    marginHorizontal: 4,
  },
  listContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 120,
  },
  image: {
    backgroundColor: Colors.inputBackground,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  listImage: {
    width: 120,
    height: '100%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    color: Colors.text,
    marginLeft: 6,
    fontSize: 14,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listTextContent: {
    flex: 1,
  },
  listTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  priceText: {
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 8,
  },
  listDetailText: {
    color: Colors.textSecondary,
    marginLeft: 6,
    fontSize: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(230, 0, 126, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewDetailsText: {
    color: Colors.text,
    fontSize: 12,
    marginLeft: 4,
  },
});

export default EventCard;
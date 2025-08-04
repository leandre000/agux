import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { ChevronLeft } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function EventMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let eventId = params.id;
  if (Array.isArray(eventId)) eventId = eventId[0];
  // Mock event data for demo
  const event = {
    venue: 'Serena Hotel Kigali',
    latitude: -1.9536,
    longitude: 30.0605,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo showProfile showSearch />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.venueTitle}>{event.venue}</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: event.latitude,
          longitude: event.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        provider={undefined}
      >
        <Marker
          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          title={event.venue}
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
    zIndex: 2,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  map: {
    flex: 1,
    width: width,
    height: height,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 0,
  },
});

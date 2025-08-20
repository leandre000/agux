import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Search, Bell, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Seat {
  id: string;
  row: number;
  number: number;
  isSelected: boolean;
  isBooked: boolean;
  isVip: boolean;
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { id, categoryId, categoryName, price } = useLocalSearchParams<{ 
    id?: string; 
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();
  
  // Generate seat map (8 rows, 6 seats per row) matching the design
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    for (let row = 1; row <= 8; row++) {
      for (let seatNum = 1; seatNum <= 6; seatNum++) {
        seats.push({
          id: `${row}-${seatNum}`,
          row,
          number: seatNum,
          isSelected: false,
          isBooked: Math.random() < 0.1, // 10% chance of being booked
          isVip: Math.random() < 0.2, // 20% chance of being VIP
        });
      }
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const selectedSeats = seats.filter(seat => seat.isSelected);

  const toggleSeat = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId && !seat.isBooked
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) return;
    
    const params = new URLSearchParams();
    params.set('count', selectedSeats.length.toString());
    params.set('seats', selectedSeats.map(s => s.id).join(','));
    if (categoryId) params.set('categoryId', categoryId);
    if (categoryName) params.set('categoryName', categoryName);
    if (price) params.set('price', price);
    
    router.push(`/event/${id}/ticket-names?${params.toString()}`);
  };

  const renderSeat = (seat: Seat) => {
    let seatStyle = [styles.seat];
    
    if (seat.isBooked) {
      seatStyle.push(styles.seatBooked as any);
    } else if (seat.isSelected) {
      seatStyle.push(styles.seatSelected as any);
    } else {
      seatStyle.push(styles.seatAvailable as any);
    }

    return (
      <TouchableOpacity
        key={seat.id}
        style={seatStyle}
        onPress={() => toggleSeat(seat.id)}
        disabled={seat.isBooked}
      />
    );
  };

  const renderRow = (rowNumber: number) => {
    const rowSeats = seats.filter(seat => seat.row === rowNumber);
    
    return (
      <View key={rowNumber} style={styles.seatRow}>
        {rowSeats.map(seat => renderSeat(seat))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Custom Header matching the design */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Seat</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seat map */}
        <View style={styles.seatMap}>
          {Array.from({ length: 8 }, (_, i) => renderRow(i + 1))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatSelected]} />
            <Text style={styles.legendText}>Your Selection ({selectedSeats.length})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatAvailable]} />
            <Text style={styles.legendText}>Selected Seats</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatBooked]} />
            <Text style={styles.legendText}>UnSelected Seats</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedSeats.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  seatMap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
  },
  seat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  seatAvailable: {
    backgroundColor: '#4CAF50',
  },
  seatSelected: {
    backgroundColor: Colors.primary,
  },
  seatBooked: {
    backgroundColor: '#666',
  },

  legend: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 12,
  },
  legendText: {
    color: Colors.text,
    fontSize: 14,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

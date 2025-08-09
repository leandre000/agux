import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

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
  
  // Generate seat map (10 rows, 12 seats per row)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    for (let row = 1; row <= 10; row++) {
      for (let seatNum = 1; seatNum <= 12; seatNum++) {
        seats.push({
          id: `${row}-${seatNum}`,
          row,
          number: seatNum,
          isSelected: false,
          isBooked: Math.random() < 0.1, // 10% chance of being booked
          isVip: row <= 3, // First 3 rows are VIP
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
      seatStyle.push(styles.seatBooked);
    } else if (seat.isSelected) {
      seatStyle.push(styles.seatSelected);
    } else if (seat.isVip) {
      seatStyle.push(styles.seatVip);
    } else {
      seatStyle.push(styles.seatAvailable);
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
      <Header showLogo showProfile showSearch />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Seat</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Screen indicator */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Text style={styles.screenText}>Screen</Text>
        </View>

        {/* Seat map */}
        <View style={styles.seatMap}>
          {Array.from({ length: 10 }, (_, i) => renderRow(i + 1))}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  screen: {
    width: 200,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginBottom: 8,
  },
  screenText: {
    color: Colors.textSecondary,
    fontSize: 12,
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
  seatVip: {
    backgroundColor: '#4CAF50',
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

import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FoodPaymentSuccessScreen() {
  const router = useRouter();
  const { id, ticketId } = useLocalSearchParams<{ id?: string; ticketId?: string }>();
  const scaleValue = new Animated.Value(0);

  useEffect(() => {
    // Animate the checkmark icon
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const handleBackToMenu = () => {
    router.push(`/event/${id}/menu`);
  };

  const handleViewOrders = () => {
    router.push(`/event/${id}/orders`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => {}}
      />
      
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}>
            <CheckCircle size={80} color="#4CAF50" />
          </Animated.View>
          
          <Text style={styles.successTitle}>Order Successful!</Text>
          <Text style={styles.successMessage}>
            Your food order has been placed successfully and linked to your ticket.
          </Text>
          
          {ticketId && (
            <View style={styles.orderDetails}>
              <Text style={styles.detailLabel}>Linked to Ticket:</Text>
              <Text style={styles.detailValue}>{ticketId}</Text>
            </View>
          )}
          
          <View style={styles.nextSteps}>
            <Text style={styles.nextStepsTitle}>What&apos;s Next?</Text>
            <Text style={styles.nextStepsText}>
              • Your order will be prepared for pickup at the event
              {'\n'}• Check your order status in the Orders section
              {'\n'}• Show your ticket ID when collecting your food
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleViewOrders}
          >
            <Text style={styles.secondaryButtonText}>View My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleBackToMenu}
          >
            <Text style={styles.primaryButtonText}>Order More Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  successTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  orderDetails: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  detailValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextSteps: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  nextStepsTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextStepsText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    paddingBottom: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

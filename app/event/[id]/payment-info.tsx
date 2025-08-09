import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

export default function PaymentInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [ticketId, setTicketId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToPayment = async () => {
    if (!ticketId.trim()) {
      // Show error for empty ticket ID
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to payment processing or success screen
      router.push(`/event/${id}/food-payment-success?ticketId=${ticketId}`);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => router.push("/search")}
      />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Payment Information</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ticket ID</Text>
              <TextInput
                style={styles.textInput}
                value={ticketId}
                onChangeText={setTicketId}
                placeholder="Enter your ticket ID"
                placeholderTextColor={Colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Please enter your ticket ID to link your food order with your event ticket. 
                This ensures your order is properly associated with your event attendance.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Payment Footer */}
        <View style={styles.paymentFooter}>
          <TouchableOpacity 
            style={[styles.proceedButton, (!ticketId.trim() || isLoading) && styles.proceedButtonDisabled]}
            onPress={handleProceedToPayment}
            disabled={!ticketId.trim() || isLoading}
          >
            <Text style={styles.proceedButtonText}>
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </Text>
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for footer
  },
  formContainer: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  infoContainer: {
    backgroundColor: 'rgba(230, 0, 126, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 0, 126, 0.2)',
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  paymentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  proceedButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

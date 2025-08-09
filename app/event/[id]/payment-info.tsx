import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

export default function PaymentInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [address, setAddress] = useState('137 Teaticket Hwy, East Falmouth MA 2536');
  const [phone, setPhone] = useState('+234 9011039271');
  const [selectedPayment, setSelectedPayment] = useState('mastercard');
  const [isLoading, setIsLoading] = useState(false);

  // Mock cart total (would come from cart store)
  const subtotal = 520;
  const total = 520;

  // Payment methods
  const paymentMethods = [
    {
      id: 'add',
      name: 'Add Payment Method',
      icon: require('@/assets/images/payment/stripe.png'),
      isAdd: true,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: require('@/assets/images/payment/mastercard.png'),
      isAdd: false,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: require('@/assets/images/payment/paypal.png'),
      isAdd: false,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: require('@/assets/images/payment/stripe.png'),
      isAdd: false,
    },
  ];

  const handleProceedToPayment = async () => {
    if (!selectedPayment || selectedPayment === 'add') {
      // Show error for no payment method selected
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to order success screen
      router.push(`/event/${id}/order-success`);
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
          {/* Address Section */}
          <View style={styles.section}>
            <View style={styles.addressRow}>
              <TextInput
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.phoneRow}>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Methods Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    selectedPayment === method.id && styles.paymentMethodSelected
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <Image source={method.icon} style={styles.paymentIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{subtotal} Rwf</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total} Rwf</Text>
            </View>
          </View>
        </ScrollView>

        {/* Payment Footer */}
        <View style={styles.paymentFooter}>
          <TouchableOpacity 
            style={[styles.proceedButton, (!selectedPayment || selectedPayment === 'add' || isLoading) && styles.proceedButtonDisabled]}
            onPress={handleProceedToPayment}
            disabled={!selectedPayment || selectedPayment === 'add' || isLoading}
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
  section: {
    marginBottom: 32,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addressInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
    marginRight: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    marginRight: 16,
  },
  changeButton: {
    paddingVertical: 4,
  },
  changeButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  paymentMethod: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: Colors.primary,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  orderSummary: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#3C3C3E',
    marginVertical: 8,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
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

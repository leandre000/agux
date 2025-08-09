import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import { TicketsAPI } from "@/lib/api";

const PAYMENT_METHODS = [
  {
    key: "mastercard",
    icon: require("@/assets/images/payment/mastercard.png"),
  },
  { key: "paypal", icon: require("@/assets/images/payment/paypal.png") },
  { key: "stripe", icon: require("@/assets/images/payment/stripe.png") },
  { key: "mtn", icon: require("@/assets/images/payment/mtn.png") },
];

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    count?: string;
    names?: string;
    seats?: string;
  }>();

  const seatCount = Math.max(1, parseInt(params.count || "1", 10));
  const names = params.names ? params.names.split(',') : [];
  const ticketPrice = 3000; // Regular ticket price in RWF
  const subtotal = seatCount * ticketPrice;
  const total = subtotal;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    PAYMENT_METHODS[0].key
  );
  const [submitting, setSubmitting] = useState(false);

  async function handlePurchase() {
    if (!selectedMethod) return;
    
    setSubmitting(true);
    try {
      // Mock API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push(`/event/${params.id}/confirmation?count=${seatCount}&amount=${total}`);
    } catch (e: any) {
      Alert.alert(
        "Purchase failed",
        e?.message || "Could not complete the purchase."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Payment</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vvip Tickets ({seatCount})</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          {names.length > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mike Peter</Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>+254 984652971</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.paymentMethodsContainer}>
          <TouchableOpacity style={styles.addMethodButton}>
            <Text style={styles.addMethodText}>+</Text>
          </TouchableOpacity>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.methodButton,
                selectedMethod === method.key && styles.methodButtonSelected,
              ]}
              onPress={() => setSelectedMethod(method.key)}
            >
              <Image source={method.icon} style={styles.methodIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Subtotal</Text>
            <Text style={styles.pricingValue}>{subtotal} Rwf</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabelTotal}>Total</Text>
            <Text style={styles.pricingValueTotal}>{total} Rwf</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.payButton, (!selectedMethod || submitting) && styles.payButtonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedMethod || submitting}
        >
          <Text style={styles.payButtonText}>
            {submitting ? "Processing..." : "Proceed to Payment"}
          </Text>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  changeText: {
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
  paymentMethodsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  addMethodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addMethodText: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  methodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonSelected: {
    borderColor: Colors.primary,
  },
  methodIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  pricingSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingLabel: {
    color: Colors.text,
    fontSize: 16,
  },
  pricingValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  pricingLabelTotal: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricingValueTotal: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  payButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
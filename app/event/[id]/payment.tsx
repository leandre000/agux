import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import Header from "@/components/Header";
import { useTicketsStore, TicketPurchase } from "@/store/tickets-store";

const PAYMENT_METHODS = [
  { key: "momo", name: "MTN Mobile Money", icon: require("@/assets/images/payment/mtn.png") },
  { key: "mastercard", name: "Mastercard", icon: require("@/assets/images/payment/mastercard.png") },
  { key: "paypal", name: "PayPal", icon: require("@/assets/images/payment/paypal.png") },
  { key: "stripe", name: "Stripe", icon: require("@/assets/images/payment/stripe.png") },
];

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    count?: string;
    names?: string;
    seats?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();

  const { purchaseTickets, purchaseLoading, error } = useTicketsStore();

  const seatCount = Math.max(1, parseInt(params.count || "1", 10));
  const names = params.names ? params.names.split(',') : [];
  const seats = params.seats ? params.seats.split(',') : [];
  const categoryId = params.categoryId || "";
  const categoryName = params.categoryName || "Standard";
  const ticketPrice = params.price ? parseInt(params.price, 10) : 0;
  const subtotal = seatCount * ticketPrice;
  const processingFee = Math.round(subtotal * 0.03); // 3% processing fee
  const total = subtotal + processingFee;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    PAYMENT_METHODS[0].key
  );

  async function handlePurchase() {
    if (!selectedMethod) {
      Alert.alert("Payment Method Required", "Please select a payment method.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Error", "Invalid ticket category. Please try again.");
      return;
    }

    if (names.length !== seatCount) {
      Alert.alert("Error", "Please provide names for all tickets.");
      return;
    }

    try {
      const purchaseData: TicketPurchase = {
        category_id: categoryId,
        quantity: seatCount,
        holder_names: names,
        seats: seats.length > 0 ? seats : undefined,
      };

      const tickets = await purchaseTickets(purchaseData);
      
      // Navigate to confirmation with ticket details
      const ticketIds = tickets.map(t => t.ticket_id || t.id).join(',');
      router.push(`/event/${params.id}/confirmation?ticketIds=${ticketIds}&count=${seatCount}&amount=${total}&categoryName=${encodeURIComponent(categoryName)}`);
      
    } catch (error: any) {
      Alert.alert(
        "Purchase Failed",
        error?.message || "Could not complete the purchase. Please try again."
      );
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
        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Event</Text>
            <Text style={styles.summaryValue}>Ticket Purchase</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Category</Text>
            <Text style={styles.summaryValue}>{categoryName}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantity</Text>
            <Text style={styles.summaryValue}>{seatCount} ticket{seatCount > 1 ? 's' : ''}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per ticket</Text>
            <Text style={styles.summaryValue}>{ticketPrice.toLocaleString()} RWF</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()} RWF</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>{processingFee.toLocaleString()} RWF</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()} RWF</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.paymentMethod,
                selectedMethod === method.key && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.key)}
            >
              <Image source={method.icon} style={styles.paymentIcon} />
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              <View style={styles.radioContainer}>
                {selectedMethod === method.key && (
                  <View style={styles.radioSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ticket Holders */}
        {names.length > 0 && (
          <View style={styles.holdersContainer}>
            <Text style={styles.holdersTitle}>Ticket Holders</Text>
            {names.map((name, index) => (
              <View key={index} style={styles.holderRow}>
                <Text style={styles.holderLabel}>Ticket {index + 1}:</Text>
                <Text style={styles.holderName}>{name}</Text>
              </View>
            ))}
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.purchaseButton, purchaseLoading && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={purchaseLoading || !selectedMethod}
        >
          {purchaseLoading ? (
            <ActivityIndicator size="small" color={Colors.text} />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Complete Purchase - {total.toLocaleString()} RWF
            </Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  paymentTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  paymentMethodName: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
  },
  radioContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  holdersContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  holdersTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  holderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  holderLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  holderName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  purchaseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
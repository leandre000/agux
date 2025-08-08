import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { TicketsAPI } from "@/lib/api";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    phone?: string;
    ticketType?: string;
    seatPrice?: string;
    categoryId?: string;
  }>();

  // Inputs
  const seatCount = Math.max(1, parseInt(params.count || "1", 10));
  const categoryId = params.categoryId; // must be passed from previous screen when category pricing is chosen
  const ticketType = params.ticketType || "Tickets";
  const names = params.names || "";
  const phone = params.phone || "";
  const seatPrice = parseInt(params.seatPrice || "0", 10) || 0;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    PAYMENT_METHODS[0].key
  );
  const [submitting, setSubmitting] = useState(false);

  const subtotal = seatCount * seatPrice;
  const fee = 20;
  const total = subtotal + fee;

  async function handlePurchase() {
    setSubmitting(true);
    try {
      // Simplified purchase without seat selection
      await TicketsAPI.purchaseTickets({ 
        categoryId: categoryId || "default"
      });
      router.push(
        `/event/${
          params.id
        }/confirmation?count=${seatCount}&ticketType=${encodeURIComponent(
          ticketType
        )}&amount=${total}`
      );
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
      <Header showLogo showProfile showSearch />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back and Title */}
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Ticket Payment</Text>
        </View>

        {/* Ticket Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {ticketType} ({seatCount})
          </Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        {names ? (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{names}</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {phone ? (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{phone}</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Payment Methods */}
        <Text style={styles.paymentTitle}>Payment</Text>
        <View style={styles.paymentMethodsRow}>
          <TouchableOpacity style={styles.addMethodBtn}>
            <Text style={styles.addMethodPlus}>+</Text>
          </TouchableOpacity>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[
                styles.methodBtn,
                selectedMethod === method.key && styles.methodBtnSelected,
              ]}
              onPress={() => setSelectedMethod(method.key)}
              activeOpacity={0.85}
            >
              <Image
                source={method.icon}
                style={
                  method.key === "mtn"
                    ? [styles.methodIcon, styles.mtnIcon]
                    : styles.methodIcon
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Subtotal and Total */}
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>{subtotal} Rwf</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabelTotal}>Total</Text>
          <Text style={styles.totalsValueTotal}>{total} Rwf</Text>
        </View>

        {/* Proceed Button */}
        <View style={styles.buttonWrap}>
          <TouchableOpacity
            style={[
              styles.payBtn,
              (!selectedMethod || submitting) && styles.payBtnDisabled,
            ]}
            disabled={!selectedMethod || submitting}
            activeOpacity={0.85}
            onPress={handlePurchase}
          >
            <Text style={styles.payBtnText}>
              {submitting ? "Processing..." : "Proceed to Payment"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  backArrow: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  paymentTitle: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 22,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  paymentMethodsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 36,
    marginTop: 0,
    minHeight: 64,
  },
  addMethodBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addMethodPlus: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  methodBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  methodBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(230,0,126,0.1)",
  },
  methodIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    resizeMode: "contain",
  },
  mtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignSelf: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 0,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 0,
  },
  summaryLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  changeText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.1,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 0,
  },
  totalsLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
  totalsValue: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  totalsLabelTotal: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  totalsValueTotal: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  buttonWrap: {
    marginTop: 32,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  payBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    width: "90%",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 0,
    elevation: 2,
  },
  payBtnDisabled: {
    opacity: 0.6,
  },
  payBtnText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.2,
  },
});

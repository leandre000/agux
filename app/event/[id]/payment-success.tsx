import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CheckCircle, Download, Share2, Home, Ticket, ArrowRight } from "lucide-react-native";
import Colors from "@/constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useOrdersStore } from "@/store/orders-store";
import { usePaymentStore } from "@/store/payment-store";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  
  const { getOrder, currentOrder, orderProcessing } = useOrdersStore();
  const { currentPayment, paymentLoading } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      if (orderId) {
        await getOrder(orderId);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load order details:', error);
      setIsLoading(false);
    }
  };

  const handleDownloadTickets = () => {
    // TODO: Implement ticket download functionality
    console.log('Downloading tickets...');
  };

  const handleShareOrder = () => {
    // TODO: Implement share functionality
    console.log('Sharing order...');
  };

  const handleViewTickets = () => {
    router.push('/tickets');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading || orderProcessing || paymentLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const order = currentOrder;
  const payment = currentPayment;

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorMessage}>
            We couldn't find the order details. Please check your tickets or contact support.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={64} color="#34C759" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successMessage}>
            Your tickets have been purchased successfully. You will receive a confirmation email shortly.
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.orderContainer}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order ID:</Text>
            <Text style={styles.orderValue}>{order.order_id}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Date:</Text>
            <Text style={styles.orderValue}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Status:</Text>
            <Text style={[styles.orderValue, styles.statusText]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total Amount:</Text>
            <Text style={[styles.orderValue, styles.amountText]}>
              {order.total.toLocaleString()} {order.currency}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {payment && (
          <View style={styles.paymentContainer}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Payment ID:</Text>
              <Text style={styles.orderValue}>{payment.payment_id}</Text>
            </View>
            
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Method:</Text>
              <Text style={styles.orderValue}>
                {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
            
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Status:</Text>
              <Text style={[styles.orderValue, styles.statusText]}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Ticket Summary */}
        <View style={styles.ticketsContainer}>
          <Text style={styles.sectionTitle}>Tickets</Text>
          
          {order.items.map((item, index) => (
            <View key={index} style={styles.ticketItem}>
              <View style={styles.ticketHeader}>
                <Ticket size={20} color={Colors.primary} />
                <Text style={styles.ticketTitle}>
                  {item.type === 'ticket' ? 'Event Ticket' : item.name}
                </Text>
              </View>
              
              <View style={styles.ticketDetails}>
                <Text style={styles.ticketDetail}>
                  Quantity: {item.quantity}
                </Text>
                <Text style={styles.ticketDetail}>
                  Price: {item.price.toLocaleString()} {order.currency}
                </Text>
                {item.metadata?.holder_names && (
                  <Text style={styles.ticketDetail}>
                    Names: {item.metadata.holder_names.join(', ')}
                  </Text>
                )}
                {item.metadata?.seats && (
                  <Text style={styles.ticketDetail}>
                    Seats: {item.metadata.seats.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsContainer}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Check Your Email</Text>
              <Text style={styles.stepDescription}>
                You'll receive a confirmation email with your tickets attached
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Download Tickets</Text>
              <Text style={styles.stepDescription}>
                Download your tickets and save them to your phone
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Attend the Event</Text>
              <Text style={styles.stepDescription}>
                Present your tickets at the event entrance
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadTickets}>
            <Download size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShareOrder}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleViewTickets}>
            <Ticket size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>View My Tickets</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Home size={20} color={Colors.textSecondary} />
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 16,
  },

  // Success Header
  successHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  // Order Container
  orderContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  orderValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  statusText: {
    color: '#34C759',
    fontWeight: '600',
  },
  amountText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Payment Container
  paymentContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  // Tickets Container
  ticketsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  ticketItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  ticketDetails: {
    marginLeft: 32,
  },
  ticketDetail: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },

  // Next Steps
  nextStepsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  // Error Container
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  homeButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
});

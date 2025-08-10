import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Edit, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money';
  name: string;
  number: string;
  isDefault: boolean;
  icon: any;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    number: '**** **** **** 4242',
    isDefault: true,
    icon: require('@/assets/images/payment/mastercard.png'),
  },
  {
    id: '2',
    type: 'mobile_money',
    name: 'MTN Mobile Money',
    number: '+250 788 123 456',
    isDefault: false,
    icon: require('@/assets/images/payment/mtn.png'),
  },
];

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (method: PaymentMethod) => void;
  onSetDefault: (method: PaymentMethod) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  onEdit, 
  onDelete, 
  onSetDefault 
}) => (
  <View style={styles.paymentCard}>
    <View style={styles.paymentCardHeader}>
      <Image source={method.icon} style={styles.paymentIcon} />
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentName}>{method.name}</Text>
        <Text style={styles.paymentNumber}>{method.number}</Text>
      </View>
      <View style={styles.paymentActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(method)}
          activeOpacity={0.7}
        >
          <Edit size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDelete(method)}
          activeOpacity={0.7}
        >
          <Trash2 size={16} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.paymentCardFooter}>
      {method.isDefault ? (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Default</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.setDefaultButton}
          onPress={() => onSetDefault(method)}
          activeOpacity={0.7}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleAddPaymentMethod = () => {
    router.push('/profile/settings' as any);
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    router.push('/profile/settings' as any);
  };

  const handleDeletePaymentMethod = (method: PaymentMethod) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete ${method.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(pm => pm.id !== method.id));
            Alert.alert('Success', 'Payment method deleted successfully');
          },
        },
      ]
    );
  };

  const handleSetDefault = (method: PaymentMethod) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        isDefault: pm.id === method.id
      }))
    );
    Alert.alert('Success', `${method.name} set as default payment method`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Add Payment Method Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPaymentMethod}
            activeOpacity={0.7}
          >
            <Plus size={24} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>

          {/* Payment Methods List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Payment Methods</Text>
            {paymentMethods.length === 0 ? (
              <View style={styles.emptyState}>
                <CreditCard size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>No Payment Methods</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Add a payment method to make purchases faster
                </Text>
              </View>
            ) : (
              paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onEdit={handleEditPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                  onSetDefault={handleSetDefault}
                />
              ))
            )}
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIcon: {
    width: 40,
    height: 24,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  paymentNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  paymentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  setDefaultButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  setDefaultText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  securityNotice: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
}); 
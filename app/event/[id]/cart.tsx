import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: any;
}

export default function CartScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  
  // Mock cart data (this would come from cart store/backend)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Soft Drinks',
      description: 'Coca and Frita',
      price: 33.00,
      quantity: 1,
      image: require('@/assets/images/m1.png'),
    },
    {
      id: '2',
      name: 'Soft Drinks',
      description: 'Coca and Frita',
      price: 33.00,
      quantity: 1,
      image: require('@/assets/images/m2.png'),
    },
    {
      id: '3',
      name: 'Soft Drinks',
      description: 'Coca and Frita',
      price: 33.00,
      quantity: 1,
      image: require('@/assets/images/m1.png'),
    },
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    router.push(`/event/${id}/payment-info`);
  };

  // Cart Item Component
  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image source={item.image} style={styles.itemImage} />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price.toFixed(2)} Rwf</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>✓</Text>
      </View>
    </View>
  );

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
          <Text style={styles.screenTitle}>Your Cart</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))
          )}
        </ScrollView>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <View style={styles.cartFooter}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{calculateTotal().toFixed(0)} Rwf</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 20,
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
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  itemPrice: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCart: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  cartFooter: {
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

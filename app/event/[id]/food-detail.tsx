import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { useFoodStore, MenuItem } from '@/store/food-store';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams<{ id?: string; itemId?: string }>();
  const [quantity, setQuantity] = useState(1);
  
  const { 
    menuItems, 
    addToCart, 
    fetchMenuItems,
    loading, 
    error,
    clearError 
  } = useFoodStore();

  const currentMenuItems = id ? menuItems[id] || [] : [];
  const foodItem = currentMenuItems.find(item => item.id === itemId);

  useEffect(() => {
    if (id && currentMenuItems.length === 0) {
      loadMenuItems();
    }
  }, [id, itemId]);

  const loadMenuItems = async () => {
    if (!id) return;
    
    try {
      clearError();
      await fetchMenuItems(id);
    } catch (error: any) {
      console.error('Failed to load menu items:', error);
    }
  };

  const handleAddToCart = () => {
    if (!foodItem || !foodItem.available) return;
    
    addToCart(foodItem, quantity);
    router.push(`/event/${id}/cart`);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        <Header showLogo showProfile showSearch />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !foodItem) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="light" />
        <Header showLogo showProfile showSearch />
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Item not found'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Food Detail</Text>
        </View>

        <View style={styles.dashedBorderContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Food Image */}
            <View style={styles.imageContainer}>
              <Image 
                source={
                  foodItem.image_url 
                    ? { uri: foodItem.image_url }
                    : require('@/assets/images/m1.png')
                } 
                style={styles.foodImage} 
              />
            </View>

            {/* Food Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              
              {/* Rating */}
              <View style={styles.ratingContainer}>
                <Text style={styles.starsText}>
                  {renderStars(foodItem.rating || 4.5)}
                </Text>
                <Text style={styles.ratingText}>
                  {(foodItem.rating || 4.5).toFixed(1)} ({foodItem.review_count || 180} reviews)
                </Text>
              </View>

              {/* Price */}
              <Text style={styles.price}>
                {foodItem.price.toLocaleString()} {foodItem.currency}
              </Text>

              {/* Description */}
              <Text style={styles.description}>
                {foodItem.description}
              </Text>

              {/* Availability Status */}
              <View style={styles.availabilityContainer}>
                <View style={[
                  styles.availabilityDot,
                  { backgroundColor: foodItem.available ? '#4CAF50' : '#ff4444' }
                ]} />
                <Text style={[
                  styles.availabilityText,
                  { color: foodItem.available ? '#4CAF50' : '#ff4444' }
                ]}>
                  {foodItem.available ? 'Available' : 'Out of Stock'}
                </Text>
              </View>

              {/* Quantity Controls */}
              {foodItem.available && (
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                      onPress={decrementQuantity}
                      disabled={quantity === 1}
                    >
                      <Minus size={20} color={quantity === 1 ? Colors.textSecondary : Colors.text} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantity}</Text>
                    
                    <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                      <Plus size={20} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Total Price */}
              {foodItem.available && (
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalPrice}>
                    {(foodItem.price * quantity).toLocaleString()} {foodItem.currency}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Add to Cart Button */}
        {foodItem.available && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartButtonText}>
                Add to Cart - {(foodItem.price * quantity).toLocaleString()} {foodItem.currency}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
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
  dashedBorderContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 250,
    backgroundColor: Colors.card,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 24,
    backgroundColor: Colors.background,
  },
  foodName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsText: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  price: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  quantityText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 24,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
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
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
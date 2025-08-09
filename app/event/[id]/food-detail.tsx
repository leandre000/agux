import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams<{ id?: string; itemId?: string }>();
  const [quantity, setQuantity] = useState(1);

  // Mock food item data (this would come from backend based on itemId)
  const foodItem = {
    id: itemId || '1',
    name: 'Cheese Burger',
    rating: 4.5,
    reviewCount: 180,
    price: 3500,
    description: 'Classic beef cheeseburger with fresh lettuce, tomatoes, onions, and our special sauce. Served with crispy fries. Perfect for sharing at events!',
    image: require('@/assets/images/m1.png'),
    inStock: true,
  };

  const handleAddToCart = () => {
    // Add to cart logic (would integrate with cart store/backend)
    console.log(`Added ${quantity}x ${foodItem.name} to cart`);
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
          <Text style={styles.screenTitle}>Event Menu</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Food Item Card */}
          <View style={styles.foodCard}>
            <View style={styles.foodImageContainer}>
              <Image source={foodItem.image} style={styles.foodImage} />
            </View>

            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>{renderStars(foodItem.rating)}</Text>
                <Text style={styles.ratingText}>{foodItem.rating}+</Text>
                <Text style={styles.reviewCount}>({foodItem.reviewCount})</Text>
              </View>

              <Text style={styles.description}>{foodItem.description}</Text>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={20} color={quantity <= 1 ? '#666' : Colors.text} />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Plus size={20} color={Colors.text} />
                </TouchableOpacity>
              </View>

              {/* Add to Cart Button */}
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                disabled={!foodItem.inStock}
              >
                <Text style={styles.addToCartText}>
                  {foodItem.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: 32,
  },
  foodCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00BFFF',
    borderStyle: 'dashed',
  },
  foodImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foodImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  foodInfo: {
    alignItems: 'center',
  },
  foodName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  reviewCount: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 32,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 24,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    width: '100%',
  },
  addToCartText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

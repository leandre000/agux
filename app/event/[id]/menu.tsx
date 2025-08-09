import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

export default function EventMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('menu');

  // Mock menu data
  const menuItems = [
    {
      id: '1',
      name: 'Big cheese burger',
      description: 'This is a big burger cheese for people',
      price: 15000,
      rating: 4.5,
      image: require('@/assets/images/m1.png'),
      category: 'food',
      inStock: true,
    },
    {
      id: '2',
      name: 'Big cheese burger',
      description: 'This is a big burger cheese for people',
      price: 15000,
      rating: 4.2,
      image: require('@/assets/images/m2.png'),
      category: 'food',
      inStock: true,
    },
    {
      id: '3',
      name: 'Big cheese burger',
      description: 'This is a big burger cheese for people',
      price: 15000,
      rating: 4.5,
      image: require('@/assets/images/m1.png'),
      category: 'food',
      inStock: false,
    },
    {
      id: '4',
      name: 'Big cheese burger',
      description: 'This is a big burger cheese for people',
      price: 15000,
      rating: 4.2,
      image: require('@/assets/images/m2.png'),
      category: 'food',
      inStock: true,
    },
  ];

  const handleOrderItem = (item: any) => {
    // Navigate to orders screen or add to cart
    router.push(`/event/${id}/orders?itemId=${item.id}`);
  };

  // Menu Item Component
  const MenuItem = ({ item }: { item: any }) => (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.menuItemImage} />
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <View style={styles.menuItemFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>{item.rating}+</Text>
          </View>
          <TouchableOpacity 
            style={[styles.orderButton, !item.inStock && styles.orderButtonDisabled]}
            onPress={() => handleOrderItem(item)}
            disabled={!item.inStock}
          >
            <Text style={styles.orderButtonText}>
              {item.inStock ? 'Order' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {!item.inStock && <View style={styles.outOfStockOverlay} />}
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
          <Text style={styles.screenTitle}>Event Orders</Text>
          <TouchableOpacity>
            <Text style={styles.recentText}>Recent</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'menu' && styles.tabActive]}
            onPress={() => setSelectedTab('menu')}
          >
            <Text style={[styles.tabText, selectedTab === 'menu' && styles.tabTextActive]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.tabActive]}
            onPress={() => {
              setSelectedTab('orders');
              router.push(`/event/${id}/orders`);
            }}
          >
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.tabTextActive]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Icons */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🍕</Text>
            </View>
            <Text style={styles.categoryText}>Pizza</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.categoryIconActive]}>
              <Text style={styles.categoryEmoji}>🍔</Text>
            </View>
            <Text style={styles.categoryText}>Burger</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🍕</Text>
            </View>
            <Text style={styles.categoryText}>Pizza</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🍕</Text>
            </View>
            <Text style={styles.categoryText}>Pizza</Text>
          </View>
        </View>

        {/* Available Foods Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Foods</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View all (30)</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.menuList}
          contentContainerStyle={styles.menuListContent}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconActive: {
    backgroundColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    color: Colors.text,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 14,
  },
  orderButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  orderButtonDisabled: {
    backgroundColor: '#666',
  },
  orderButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
});
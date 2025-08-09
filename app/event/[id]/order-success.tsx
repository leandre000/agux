import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  
  // Animation refs
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkRotate = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const dotsScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Start animations sequence
    const animateSuccess = () => {
      // Animate dots first
      Animated.parallel([
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(dotsScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Then animate checkmark
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkRotate, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // Animate dots continuously
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dotsScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(dotsScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };
      
      setTimeout(animateDots, 1000);
    };

    animateSuccess();
  }, []);

  const handleGoBackToOrders = () => {
    router.push(`/event/${id}/orders`);
  };

  const rotation = checkmarkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Create animated dots around the checkmark
  const renderAnimatedDots = () => {
    const dots = [];
    const dotCount = 8;
    const radius = 80;
    
    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 360) / dotCount;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;
      
      dots.push(
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: dotsScale },
              ],
              opacity: dotsOpacity,
            },
          ]}
        />
      );
    }
    
    return dots;
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
        <View style={styles.successContainer}>
          <View style={styles.animationContainer}>
            {renderAnimatedDots()}
            <Animated.View
              style={[
                styles.checkmarkContainer,
                {
                  transform: [
                    { scale: checkmarkScale },
                    { rotate: rotation },
                  ],
                },
              ]}
            >
              <View style={styles.checkmarkCircle}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
            </Animated.View>
          </View>
          
          <Text style={styles.successTitle}>Your order has been successfully placed</Text>
          <Text style={styles.successMessage}>
            Sit and relax while your orders is being worked on. It'll take 5min before you get it
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBackToOrders}
          >
            <Text style={styles.backButtonText}>Go back to orders</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  animationContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  checkmarkContainer: {
    position: 'absolute',
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  checkmarkIcon: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  successTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  successMessage: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionContainer: {
    paddingBottom: 32,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

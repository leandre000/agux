import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    ticketIds?: string;
    count?: string;
    amount?: string;
    categoryName?: string;
  }>();

  const ticketCount = parseInt(params.count || '1', 10);
  const amount = params.amount || '0';
  const categoryName = params.categoryName ? decodeURIComponent(params.categoryName) : 'Standard';


  // Animation values
  const checkScale = new Animated.Value(0);
  const checkOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate check mark appearance
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [checkScale, checkOpacity]);

  const handleGoBack = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {/* Success Message */}
        <Text style={styles.title}>
          You have successfully{'\n'}bought tickets
        </Text>
        
        <Text style={styles.subtitle}>
          You have now bought {ticketCount} {categoryName} ticket{ticketCount > 1 ? 's' : ''}{'\n'}
          for {parseInt(amount).toLocaleString()} RWF.{'\n'}
          Your tickets are ready to use!
        </Text>

        {/* Animated Check Mark */}
        <Animated.View 
          style={[
            styles.checkContainer,
            {
              transform: [{ scale: checkScale }],
              opacity: checkOpacity,
            }
          ]}
        >
          <View style={styles.checkCircle}>
            <View style={styles.checkMark}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          </View>
        </Animated.View>

        {/* Go Back Button */}
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Go back to Events</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
    opacity: 0.8,
  },
  checkContainer: {
    marginBottom: 60,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  checkMark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
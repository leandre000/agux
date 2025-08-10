import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function NetworkError({ 
  message = "Request failed with status code 404", 
  onRetry, 
  showRetry = true 
}: NetworkErrorProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <WifiOff size={48} color="#e6007e" />
          </View>
          
          <Text style={styles.title}>Connection Error</Text>
          <Text style={styles.message}>{message}</Text>
          
          {showRetry && onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <RefreshCw size={20} color="#ffffff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.helpText}>
            Please check your internet connection and try again
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#e6007e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

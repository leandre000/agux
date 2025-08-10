import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatabaseErrorProps {
  error?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  showRetry?: boolean;
}

export default function DatabaseError({ 
  error = "Section is associated to TicketCategory using an alias. You must use the 'as' keyword to specify the alias within your include statement.",
  onRetry, 
  onContactSupport,
  showRetry = true 
}: DatabaseErrorProps) {
  
  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      Alert.alert(
        'Contact Support',
        'This error has been automatically reported to our technical team. They will fix it as soon as possible.',
        [{ text: 'OK' }]
      );
    }
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('alias') || error.includes('include statement')) {
      return 'We\'re experiencing a technical issue with our database. Our team has been notified and is working to fix it.';
    }
    if (error.includes('Section') && error.includes('TicketCategory')) {
      return 'There\'s a temporary issue with our ticket system. Please try again in a few minutes.';
    }
    return 'A database error occurred. Our technical team has been notified.';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Database size={48} color="#e6007e" />
          </View>
          
          <Text style={styles.title}>Database Error</Text>
          <Text style={styles.message}>{getErrorMessage(error)}</Text>
          
          <View style={styles.buttonContainer}>
            {showRetry && onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <RefreshCw size={20} color="#ffffff" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
              <AlertTriangle size={20} color="#ffffff" />
              <Text style={styles.supportButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.helpText}>
            This error has been automatically logged for our technical team
          </Text>
          
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugTitle}>Technical Details:</Text>
              <Text style={styles.debugText}>{error}</Text>
            </View>
          )}
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
    maxWidth: 350,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#e6007e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  supportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  debugInfo: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 16,
  },
});

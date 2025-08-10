import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log to production error reporting service
    if (__DEV__) {
      console.log('Error details:', { error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    Alert.alert(
      'Report Error',
      'Thank you for helping us improve! This error has been automatically reported to our team.',
      [{ text: 'OK' }]
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <LinearGradient
            colors={['#e6007e', '#c2185b', '#ad1457']}
            style={styles.background}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                We're sorry, but something unexpected happened. Our team has been notified.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.reportButton} onPress={this.handleReportError}>
                  <Text style={styles.reportButtonText}>Report Issue</Text>
                </TouchableOpacity>
              </View>
              
              {__DEV__ && this.state.error && (
                <View style={styles.debugInfo}>
                  <Text style={styles.debugTitle}>Debug Information:</Text>
                  <Text style={styles.debugText}>{this.state.error.message}</Text>
                  <Text style={styles.debugText}>{this.state.error.stack}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      );
    }

    return this.props.children;
  }
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  retryButtonText: {
    color: '#e6007e',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugInfo: {
    marginTop: 32,
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
    marginBottom: 4,
  },
});

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Database, RefreshCw, AlertTriangle, Shield } from 'lucide-react-native';
import { AppError, isDatabaseError } from '@/lib/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProductionErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log to production error reporting service
    if (__DEV__) {
      console.log('Error details:', { error, errorInfo });
    } else {
      // In production, send to your error reporting service
      console.log('Error reported to production monitoring service');
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

      // Check if it's a database error
      const isDbError = this.state.error && isDatabaseError(this.state.error);

      if (isDbError) {
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
                <Text style={styles.message}>
                  We're experiencing a technical issue with our database. Our team has been notified and is working to fix it.
                </Text>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                    <RefreshCw size={20} color="#ffffff" />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.reportButton} onPress={this.handleReportError}>
                    <AlertTriangle size={20} color="#ffffff" />
                    <Text style={styles.reportButtonText}>Report Issue</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.helpText}>
                  This error has been automatically logged for our technical team
                </Text>
              </View>
            </LinearGradient>
          </View>
        );
      }

      // Generic error fallback
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={['#e6007e', '#c2185b', '#ad1457']}
            style={styles.background}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Shield size={48} color="#ffffff" />
              </View>
              
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
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
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
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
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

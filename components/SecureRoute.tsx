import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { SECURITY_CONFIG } from '@/config/security';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppState } from '@/hooks/useAppState';

interface SecureRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
  enableBiometric?: boolean;
  sessionTimeout?: number;
  maxInactivityTime?: number;
}

export default function SecureRoute({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
  fallback,
  securityLevel = 'medium',
  enableBiometric = false,
  sessionTimeout = SECURITY_CONFIG.SESSION.INACTIVITY_TIMEOUT,
  maxInactivityTime = SECURITY_CONFIG.SESSION.INACTIVITY_TIMEOUT,
}: SecureRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, checkAuthStatus, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticatedBiometric, setIsAuthenticatedBiometric] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLocked, setIsLocked] = useState(false);
  const appState = useAppState();

  // Security level configurations
  const securityConfigs = {
    low: {
      requireBiometric: false,
      sessionTimeout: sessionTimeout * 2,
      maxInactivityTime: maxInactivityTime * 2,
    },
    medium: {
      requireBiometric: enableBiometric,
      sessionTimeout,
      maxInactivityTime,
    },
    high: {
      requireBiometric: true,
      sessionTimeout: sessionTimeout * 0.5,
      maxInactivityTime: maxInactivityTime * 0.5,
    },
    critical: {
      requireBiometric: true,
      sessionTimeout: 5 * 60 * 1000, // 5 minutes
      maxInactivityTime: 2 * 60 * 1000, // 2 minutes
    },
  };

  const currentSecurity = securityConfigs[securityLevel];

  // Check authentication status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  // Handle app state changes
  useEffect(() => {
    if (appState === 'background' && currentSecurity.requireBiometric) {
      setIsLocked(true);
    }
  }, [appState, currentSecurity.requireBiometric]);

  // Handle back button (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isLocked) {
        return true; // Prevent back navigation when locked
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isLocked]);

  // Session timeout handler
  useEffect(() => {
    if (!isAuthenticated || !currentSecurity.sessionTimeout) return;

    const sessionTimer = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > currentSecurity.sessionTimeout) {
        handleSessionTimeout();
      }
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, [isAuthenticated, lastActivity, currentSecurity.sessionTimeout]);

  // Inactivity timeout handler
  useEffect(() => {
    if (!isAuthenticated || !currentSecurity.maxInactivityTime) return;

    const inactivityTimer = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > currentSecurity.maxInactivityTime) {
        handleInactivityTimeout();
      }
    }, 1000);

    return () => clearInterval(inactivityTimer);
  }, [isAuthenticated, lastActivity, currentSecurity.maxInactivityTime]);

  // Update last activity on user interaction
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Handle session timeout
  const handleSessionTimeout = async () => {
    Alert.alert(
      'Session Expired',
      'Your session has expired for security reasons. Please log in again.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  // Handle inactivity timeout
  const handleInactivityTimeout = async () => {
    Alert.alert(
      'Inactivity Timeout',
      'You have been inactive for too long. Please log in again.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  // Biometric authentication
  const authenticateBiometric = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access the app',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  // Handle biometric authentication requirement
  useEffect(() => {
    if (isAuthenticated && currentSecurity.requireBiometric && !isAuthenticatedBiometric && !isLocked) {
      const checkBiometric = async () => {
        const success = await authenticateBiometric();
        if (success) {
          setIsAuthenticatedBiometric(true);
          updateActivity();
        } else {
          // Fallback to logout if biometric fails
          await logout();
          router.replace('/auth/login');
        }
      };

      checkBiometric();
    }
  }, [isAuthenticated, currentSecurity.requireBiometric, isAuthenticatedBiometric, isLocked]);

  // Handle authentication requirements
  useEffect(() => {
    if (isChecking) return;

    // Handle authentication requirements
    if (requireAuth && !isAuthenticated) {
      const target = redirectTo || '/auth/login';
      router.replace(target);
      return;
    }

    // Handle guest-only requirements
    if (requireGuest && isAuthenticated) {
      const target = redirectTo || '/(tabs)';
      router.replace(target);
      return;
    }

    // Handle biometric requirement
    if (requireAuth && isAuthenticated && currentSecurity.requireBiometric && !isAuthenticatedBiometric) {
      setIsLocked(true);
      return;
    }
  }, [isAuthenticated, requireAuth, requireGuest, redirectTo, router, isChecking, currentSecurity.requireBiometric, isAuthenticatedBiometric]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Verifying security...</Text>
      </View>
    );
  }

  // Show biometric lock screen
  if (isLocked && currentSecurity.requireBiometric) {
    return (
      <View style={styles.lockContainer}>
        <Text style={styles.lockTitle}>🔒 App Locked</Text>
        <Text style={styles.lockMessage}>
          Please authenticate to continue
        </Text>
        <Text 
          style={styles.unlockButton}
          onPress={async () => {
            const success = await authenticateBiometric();
            if (success) {
              setIsAuthenticatedBiometric(true);
              setIsLocked(false);
              updateActivity();
            }
          }}
        >
          🔓 Unlock
        </Text>
      </View>
    );
  }

  // Show fallback if provided and conditions aren't met
  if (fallback && (
    (requireAuth && !isAuthenticated) ||
    (requireGuest && isAuthenticated) ||
    (requireAuth && isAuthenticated && currentSecurity.requireBiometric && !isAuthenticatedBiometric)
  )) {
    return <>{fallback}</>;
  }

  // Render children if all conditions are met
  return (
    <View style={styles.container} onTouchStart={updateActivity}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 24,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  lockMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  unlockButton: {
    fontSize: 18,
    color: '#E6007E',
    fontWeight: '600',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E6007E',
    borderRadius: 8,
  },
});

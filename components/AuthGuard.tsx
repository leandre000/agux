import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
  fallback
}: AuthGuardProps) {
  const { isAuthenticated, user, checkAuthStatus, isLoading } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

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

  useEffect(() => {
    if (isChecking || isLoading) return;

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
  }, [isAuthenticated, requireAuth, requireGuest, redirectTo, router, isChecking, isLoading]);

  // Show loading state while checking authentication
  if (isChecking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show fallback if provided and conditions aren't met
  if (fallback && (
    (requireAuth && !isAuthenticated) ||
    (requireGuest && isAuthenticated)
  )) {
    return <>{fallback}</>;
  }

  // Render children if all conditions are met
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.text,
    fontSize: 16,
  },
});

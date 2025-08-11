import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

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
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait a bit for auth state to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isChecking) return;

    // Handle authentication requirements
    if (requireAuth && !isAuthenticated) {
      const target = redirectTo || '/auth/login';
      router.replace(target as any);
      return;
    }

    // Handle guest-only requirements
    if (requireGuest && isAuthenticated) {
      const target = redirectTo || '/(tabs)';
      router.replace(target as any);
      return;
    }
  }, [isAuthenticated, requireAuth, requireGuest, redirectTo, router, isChecking]);

  // Show loading state while checking authentication
  if (isChecking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
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
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});

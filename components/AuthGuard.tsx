import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '@/lib/authToken';
import Colors from '@/constants/Colors';

interface AuthGuardProps {
  children: React.ReactNode;
  requireGuest?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  requireGuest = false,
  redirectTo,
  fallback
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const hasToken = !!token;
      
      setIsAuthenticated(hasToken);

      // Handle guest-only routes (like login/register)
      if (requireGuest && hasToken) {
        const target = redirectTo || '/(tabs)' as any;
        router.replace(target);
        return;
      }

      // Handle authenticated routes
      if (!requireGuest && !hasToken) {
        const target = redirectTo || '/auth/login' as any;
        router.replace(target);
        return;
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      
      if (!requireGuest) {
        const target = redirectTo || '/auth/login' as any;
        router.replace(target);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show fallback if provided and conditions aren't met
  if (fallback && (
    (requireGuest && isAuthenticated) ||
    (!requireGuest && !isAuthenticated)
  )) {
    return <>{fallback}</>;
  }

  // Show children if conditions are met
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
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
});

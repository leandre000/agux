import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProductionErrorBoundary } from '@/components/ProductionErrorBoundary';
import CustomSplashScreen from '@/components/CustomSplashScreen';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);

  React.useEffect(() => {
    // Hide splash screen after a short delay for smooth transition
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const content = (
    <>
      <StatusBar style="light" backgroundColor="#e6007e" />
      <CustomSplashScreen visible={isSplashVisible} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'none' }} />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/register-email" />
        <Stack.Screen name="auth/register-phone" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="auth/reset-password" />
        <Stack.Screen name="auth/verification" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="events/user" />
      </Stack>
    </>
  );

  if (Platform.OS === 'web') {
    return <ProductionErrorBoundary>{content}</ProductionErrorBoundary>;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#e6007e' }}>
      <ProductionErrorBoundary>{content}</ProductionErrorBoundary>
    </GestureHandlerRootView>
  );
}

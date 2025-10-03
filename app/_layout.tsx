import CustomSplashScreen from '@/components/CustomSplashScreen';
import { ProductionErrorBoundary } from '@/components/ProductionErrorBoundary';
import { ToastProvider } from '@/components/ToastProvider';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      <StatusBar style="light" backgroundColor={Colors.background} />
      <CustomSplashScreen visible={isSplashVisible} />
      <ToastProvider>
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {/* Public screens - no authentication required */}
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'none' }} />
        <Stack.Screen name="welcome" options={{ animation: 'none' }} />
        
        {/* Auth screens - require guest access */}
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="auth/register-email" 
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="auth/register-phone" 
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: true 
          }} 
        />
        
        {/* Protected screens - require authentication */}
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="profile" />
        <Stack.Screen name="events/user" />
        <Stack.Screen name="event" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="modal" />
        </Stack>
      </ToastProvider>
    </>
  );

  if (Platform.OS === 'web') {
    return <ProductionErrorBoundary>{content}</ProductionErrorBoundary>;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProductionErrorBoundary>{content}</ProductionErrorBoundary>
    </GestureHandlerRootView>
  );
}

import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const content = (
    <>
      <StatusBar style="light" backgroundColor="#e6007e" />
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
        <Stack.Screen name="profile/setup" />
        <Stack.Screen name="profile/categories" />
        <Stack.Screen name="profile/settings" />
        <Stack.Screen name="profile/change-password" />
        <Stack.Screen name="profile/payment-methods" />
        <Stack.Screen name="profile/notifications" />
        <Stack.Screen name="profile/help-support" />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="events/user" />
      </Stack>
    </>
  );

  if (Platform.OS === 'web') {
    return content;
  }
  return <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#e6007e' }}>{content}</GestureHandlerRootView>;
}

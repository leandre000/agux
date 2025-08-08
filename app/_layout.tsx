import React from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  const content = (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
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
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="events/user" />
      </Stack>
    </>
  );

  if (Platform.OS === 'web') {
    return content;
  }
  return <GestureHandlerRootView style={{ flex: 1 }}>{content}</GestureHandlerRootView>;
}

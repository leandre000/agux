import { Stack } from 'expo-router';
import React from 'react';
import AuthGuard from '@/components/AuthGuard';

export default function EventLayout() {
  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="[id]" />
        <Stack.Screen name="[id]/cart" />
        <Stack.Screen name="[id]/confirmation" />
        <Stack.Screen name="[id]/food-detail" />
        <Stack.Screen name="[id]/food-payment-success" />
        <Stack.Screen name="[id]/map" />
        <Stack.Screen name="[id]/menu" />
        <Stack.Screen name="[id]/order-success" />
        <Stack.Screen name="[id]/orders" />
        <Stack.Screen name="[id]/payment-info" />
        <Stack.Screen name="[id]/payment" />
        <Stack.Screen name="[id]/seat-selection" />
        <Stack.Screen name="[id]/ticket-names" />
        <Stack.Screen name="[id]/ticket-preview" />
      </Stack>
    </AuthGuard>
  );
}

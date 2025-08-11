import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import AuthGuard from './AuthGuard';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthGuard requireGuest={true} redirectTo="/(tabs)">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
          translucent={false}
        />
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
});

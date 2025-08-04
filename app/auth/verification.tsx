import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Header from '@/components/Header';
import VerificationInput from '@/components/VerificationInput';

export default function VerificationScreen() {
  const router = useRouter();
  const { verifyAccount, isLoading, error } = useAuthStore();

  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!code || code.length !== 5) return;

    try {
      await verifyAccount(code);
      router.push('/(tabs)');
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Account Verification" showBack />

      <View style={styles.content}>
        <Text style={styles.description}>
          We have sent verification code on your email or phone use it to activate your account
        </Text>

        <VerificationInput
          length={5}
          onCodeFilled={setCode}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Verify Account"
          onPress={handleVerify}
          loading={isLoading}
          style={styles.verifyButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 32,
    width: '100%',
  },
});

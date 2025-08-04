import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    if (!identifier) {
      setValidationError('Please enter your phone number or email');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validateForm()) return;
    try {
      await resetPassword(identifier);
      router.push('/auth/reset-password');
    } catch {
      // handled in store
    }
  };

  return (
    <AuthLayout>
      <Header title="Forgot Password" showBack />
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your phone number or email to receive the reset code for account recovery
        </Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number or Email"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationError}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title="Send Verification Code"
          onPress={handleSendCode}
          loading={isLoading}
          style={styles.sendButton}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  sendButton: {
    marginTop: 32,
  },
});

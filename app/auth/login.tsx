import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import AuthLayout from '@/components/AuthLayout';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    identifier: '',
    password: '',
  });

  const validateForm = () => {
    const errors = { identifier: '', password: '' };

    if (!identifier) errors.identifier = 'Enter phone number or email';
    if (!password) errors.password = 'Please enter your password';

    setValidationErrors(errors);

    return !errors.identifier && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ identifier, password });
      router.replace('/(tabs)');
    } catch {
      // error handled in store
    }
  };

  return (
    <AuthLayout>
      <Header title="Login" showBack />

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number or Email"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationErrors.identifier}
            autoCapitalize="none"
            keyboardType="email-address"
          
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            error={validationErrors.password}
            isPassword
         
          />

          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupLink}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  inputContainer: {
    width: '100%',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: Colors.text,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 32,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import SocialLoginButton from '@/components/SocialLoginButton';
import AuthLayout from '@/components/AuthLayout';


export default function RegisterPhoneScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({ phone: '', password: '' });

  const validateForm = () => {
    const errors = { phone: '', password: '' };
    if (!phone) errors.phone = 'Please enter your phone number';
    else if (!/^\d{10,}$/.test(phone.replace(/\D/g, '')))
      errors.phone = 'Please enter a valid phone number';
    if (!password) errors.password = 'Please enter a password';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setValidationErrors(errors);
    return !errors.phone && !errors.password;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    try {
      await register({ phone, password });
      router.push('/auth/verification');
    } catch {
      // handled in store
    }
  };

  return (
    <AuthLayout>
      <Header title="Register with Phone" showBack />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            error={validationErrors.phone}
            keyboardType="phone-pad"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            error={validationErrors.password}
            isPassword
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          loading={isLoading}
          style={styles.signUpButton}
        />
        <View style={styles.socialContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialButtonsRow}>
            <SocialLoginButton provider="apple" onPress={() => router.push('/profile/setup')} showText={false} style={styles.socialButton} />
            <SocialLoginButton provider="google" onPress={() => router.push('/profile/setup')} showText={false} style={styles.socialButton} />
            <SocialLoginButton provider="gmail" onPress={() => router.push('/profile/setup')} showText={false} style={styles.socialButton} />
          </View>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Login</Text>
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
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 32,
  },
  socialContainer: {
    marginTop: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    marginHorizontal: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

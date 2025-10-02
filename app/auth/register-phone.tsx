import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import SocialLoginButton from '@/components/SocialLoginButton';
import Colors from '@/constants/Colors';
import { commonValidations, useFormValidation } from '@/hooks/useFormValidation';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PhoneRegisterFormValues {
  phone: string;
  password: string;
}

const phoneRegisterValidationSchema = {
  phone: commonValidations.phone,
  password: commonValidations.password,
};

export default function RegisterPhoneScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<PhoneRegisterFormValues>(
    {
      phone: '',
      password: '',
    },
    phoneRegisterValidationSchema,
    async (values) => {
      try {
        await register({ phone: values.phone, password: values.password });
        // Registration successful, user will be automatically logged in and redirected
        router.replace('/(tabs)');
      } catch {
        // handled in store
      }
    }
  );

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <AuthLayout>
      <Header title="Register with Phone" showBack />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            label="Phone Number"
            placeholder="Phone Number"
            value={getFieldValue('phone')}
            onChangeText={(text) => setFieldValue('phone', text)}
            onBlur={() => setFieldTouched('phone')}
            error={getFieldError('phone')}
            keyboardType="phone-pad"
          />
          <Input
            label="Password"
            placeholder="Password"
            value={getFieldValue('password')}
            onChangeText={(text) => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            error={getFieldError('password')}
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          title="Sign Up"
          onPress={handleSubmit}
          loading={isSubmitting || isLoading}
          style={styles.signUpButton}
          fullWidth
          size="large"
          disabled={!formik.isValid || !formik.dirty}
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

import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import SocialLoginButton from '@/components/SocialLoginButton';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useFormValidation, commonValidations } from '@/hooks/useFormValidation';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RegisterFormValues {
  email: string;
  phone: string;
  password: string;
  name: string;
}

const registerValidationSchema = {
  name: commonValidations.name,
  email: commonValidations.email,
  phone: commonValidations.phone,
  password: commonValidations.password,
};

export default function RegisterEmailScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<RegisterFormValues>(
    {
      email: '',
      phone: '',
      password: '',
      name: '',
    },
    registerValidationSchema,
    async (values) => {
      try {
        await register({ 
          email: values.email, 
          phone: values.phone, 
          password: values.password, 
          username: values.name
        });
        // Registration successful, user will be automatically logged in and redirected
        router.replace('/(tabs)');
      } catch {
        // Error handled in the store
      }
    }
  );

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social auth later
    router.push('/profile/setup');
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <AuthLayout>
      <Header title="Register with Email" showBack />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Full Name"
            value={getFieldValue('name')}
            onChangeText={(text) => setFieldValue('name', text)}
            onBlur={() => setFieldTouched('name')}
            error={getFieldError('name')}
            autoCapitalize="words"
          />

          <Input
            placeholder="Email"
            value={getFieldValue('email')}
            onChangeText={(text) => setFieldValue('email', text)}
            onBlur={() => setFieldTouched('email')}
            error={getFieldError('email')}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Phone Number"
            value={getFieldValue('phone')}
            onChangeText={(text) => setFieldValue('phone', text)}
            onBlur={() => setFieldTouched('phone')}
            error={getFieldError('phone')}
            keyboardType="phone-pad"
          />

          <Input
            placeholder="Password"
            value={getFieldValue('password')}
            onChangeText={(text) => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            error={getFieldError('password')}
            secureTextEntry
          />
        </View>

        <Button
          title="Sign Up"
          onPress={handleSubmit}
          loading={isSubmitting || isLoading}
          style={styles.signUpButton}
          disabled={!formik.isValid || !formik.dirty}
        />

        <View style={styles.socialContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsRow}>
            <SocialLoginButton
              provider="google"
              onPress={() => handleSocialLogin('google')}
              showText={false}
              style={styles.socialButton}
            />
            <SocialLoginButton
              provider="phone"
              onPress={() => handleSocialLogin('phone')}
              showText={false}
              style={styles.socialButton}
            />
          </View>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
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

import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import SocialLoginButton from '@/components/SocialLoginButton';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterEmailScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
  });

  const validateForm = () => {
    const errors = {
      email: '',
      phone: '',
      password: '',
      name: '',
    };

    if (!name) {
      errors.name = 'Please enter your name';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      errors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!phone) {
      errors.phone = 'Please enter your phone number';
    } else if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!password) {
      errors.password = 'Please enter a password';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.phone && !errors.password && !errors.name;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await register({ 
        email, 
        phone, 
        password, 
        username: name
      });
      router.push('/auth/verification');
    } catch {
      // Error handled in the store
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social auth later
    router.push('/profile/setup');
  };

  return (
    <AuthLayout>
      <Header title="Register with Email" showBack />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            error={validationErrors.name}
            autoCapitalize="words"
          />

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            error={validationErrors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

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

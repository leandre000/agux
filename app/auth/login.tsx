import AuthGuard from "@/components/AuthGuard";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import NetworkError from "@/components/NetworkError";
import { API_BASE_URL } from "@/config/api";
import { useToast } from "@/components/ToastProvider";
import Colors from "@/constants/Colors";
import { commonValidations, useFormValidation } from "@/hooks/useFormValidation";
import { login, validateEmail, validatePhone } from "@/lib/api/auth";
import { setToken } from "@/lib/authToken";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LoginFormValues {
  identifier: string;
  password: string;
}

const loginValidationSchema = {
  identifier: (value: string) => {
    if (!value) return 'Email or phone number is required';
    if (validateEmail(value) || validatePhone(value)) return null;
    return 'Please enter a valid email or phone number';
  },
  password: commonValidations.required('Password'),
};

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<LoginFormValues>(
    {
      identifier: "",
      password: "",
    },
    loginValidationSchema,
    async (values) => {
      try {
        setIsLoading(true);
        setError(null);
        setNetworkError(false);
        
        const response = await login(values);
        
        if (response.success && response.token) {
          await setToken(response.token);
          showToast("Welcome back!", { type: 'success' });
          router.replace("/(tabs)");
        } else {
          setError(response.message || "Login failed. Please try again.");
        }
      } catch (error: any) {
        console.error('Login error:', error);
        
        // Check if it's a network error
        if (error?.message?.includes('Network Error') || 
            error?.message?.includes('timeout') ||
            error?.code === 'NETWORK_ERROR') {
          setNetworkError(true);
        } else {
          setError(error?.message || "Login failed. Please check your credentials and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNetworkError(false);
      
      const redirectUrl = Linking.createURL("/auth/login");
      const authUrl = `${API_BASE_URL}/api/users/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const query = parsed.queryParams || {};
        const token = String(query.token || "");
        const email = String(query.email || "");
        const name = String(query.name || "");
        
        if (token) {
          await setToken(token);
          router.replace("/(tabs)");
          return;
        }
      }
      
      setError("Google login was cancelled or failed. Please try again.");
    } catch (error: any) {
      console.error('Google login error:', error);
      
      if (error?.message?.includes('Network Error') || 
          error?.message?.includes('timeout')) {
        setNetworkError(true);
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setNetworkError(false);
    setError(null);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  // Show network error if there's a network issue
  if (networkError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Header title="Login" showBack />
        <NetworkError 
          message="Unable to connect to our servers. Please check your internet connection."
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <AuthGuard requireGuest redirectTo="/(tabs)">
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Header title="Login" showBack />

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Input
              label="Email or Phone"
              placeholder="Email or Phone Number"
              value={getFieldValue('identifier')}
              onChangeText={(text) => setFieldValue('identifier', text)}
              onBlur={() => setFieldTouched('identifier')}
              error={getFieldError('identifier')}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Password"
              value={getFieldValue('password')}
              onChangeText={(text) => setFieldValue('password', text)}
              onBlur={() => setFieldTouched('password')}
              error={getFieldError('password')}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <View style={styles.bottomSection}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Login"
              onPress={handleSubmit}
              loading={isSubmitting || isLoading}
              style={styles.loginButton}
              fullWidth
              size="large"
              disabled={!formik.isValid || !formik.dirty}
            />

            <Button
              title="Continue with Google"
              onPress={handleGoogleLogin}
              style={styles.googleButton}
              fullWidth
              size="large"
              disabled={isLoading}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </AuthGuard>
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
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  bottomSection: {
    width: "100%",
    paddingBottom: 32,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
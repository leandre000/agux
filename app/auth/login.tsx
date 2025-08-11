import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import NetworkError from "@/components/NetworkError";
import { API_BASE_URL } from "@/config/api";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useFormValidation, commonValidations } from "@/hooks/useFormValidation";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LoginFormValues {
  identifier: string;
  password: string;
}

const loginValidationSchema = {
  identifier: commonValidations.required('Email or phone number'),
  password: commonValidations.required('Password'),
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
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
        setNetworkError(false);
        await login(values);
        router.replace("/(tabs)");
      } catch (error: any) {
        // Check if it's a network error
        if (error?.message?.includes('Network Error') || 
            error?.message?.includes('timeout') ||
            error?.code === 'NETWORK_ERROR') {
          setNetworkError(true);
        } else {
          // Show error alert for other errors
          Alert.alert(
            "Login Failed",
            error?.message || "Please check your credentials and try again.",
            [{ text: "OK" }]
          );
        }
      }
    }
  );

  const handleGoogleLogin = async () => {
    try {
      setNetworkError(false);
      const redirectUrl = Linking.createURL("/auth/login");
      const authUrl = `${API_BASE_URL}/auth/google`; // server route prefix commonly '/auth'
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        // Expect the server to redirect to agura://auth/login?token=...&email=...&name=... or similar
        const parsed = Linking.parse(result.url);
        const query = parsed.queryParams || {};
        const token = String(query.token || "");
        const email = String(query.email || "");
        const name = String(query.name || "");
        if (token) {
          // Store token via store's internal setter (using login success path)
          const setState = (useAuthStore as any).setState;
          await (await import("@/lib/authToken"))
            .setToken?.(token)
            .catch(() => {});
          setState({
            isAuthenticated: true,
            user: { id: String(query.user_id || ""), email, username: name },
          });
          router.replace("/(tabs)");
          return;
        }
      }
    } catch (error: any) {
      if (error?.message?.includes('Network Error') || 
          error?.message?.includes('timeout')) {
        setNetworkError(true);
      } else {
        Alert.alert(
          "Google Login Failed",
          "Unable to connect to Google. Please try again.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const handleRetry = () => {
    setNetworkError(false);
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Login" showBack />

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number or Gmail"
            value={getFieldValue('identifier')}
            onChangeText={(text) => setFieldValue('identifier', text)}
            onBlur={() => setFieldTouched('identifier')}
            error={getFieldError('identifier')}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Input
            placeholder="Password"
            value={getFieldValue('password')}
            onChangeText={(text) => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            error={getFieldError('password')}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Login"
            onPress={formik.handleSubmit}
            loading={isSubmitting || isLoading}
            style={styles.loginButton}
            disabled={!formik.isValid || !formik.dirty}
          />

          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            style={styles.googleButton}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
  },
  forgotPasswordLink: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
  },
  bottomSection: {
    width: "100%",
    paddingBottom: 32,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#E6007E",
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 32,
  },
  googleButtonText: {
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#aaa",
    fontSize: 14,
  },
  signupLink: {
    color: "#E6007E",
    fontSize: 14,
    fontWeight: "500",
  },
});
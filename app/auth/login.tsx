import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { API_BASE_URL } from "@/config/api";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    identifier: "",
    password: "",
  });

  const validateForm = () => {
    const errors = { identifier: "", password: "" };

    if (!identifier) errors.identifier = "Enter phone number or email";
    if (!password) errors.password = "Please enter your password";

    setValidationErrors(errors);

    return !errors.identifier && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ identifier, password });
      router.replace("/(tabs)");
    } catch {
      // error handled in store
      // Optionally log or toast error here
    }
  };

  const handleGoogleLogin = async () => {
    try {
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
    } catch {
      // ignore, surfaced via UI if needed
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Login" showBack />

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number or Gmail"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationErrors.identifier}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            error={validationErrors.password}
            isPassword
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            style={[styles.loginButton, styles.googleButton]}
            textStyle={styles.googleButtonText}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
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
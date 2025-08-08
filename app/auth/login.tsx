import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Header from "@/components/Header";
import AuthLayout from "@/components/AuthLayout";
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
            onPress={() => router.push("/auth/forgot-password")}
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

        <View style={styles.oauthWrap}>
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
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
    justifyContent: "space-between",
    marginTop: 16,
  },
  inputContainer: {
    width: "100%",
  },
  forgotPasswordLink: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: Colors.text,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 32,
  },
  oauthWrap: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  googleBtn: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
  },
  googleBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

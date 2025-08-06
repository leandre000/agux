import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Header from "@/components/Header";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    // Backend accepts email or phone as 'identifier'
    if (!identifier) {
      setValidationError("Enter phone number or email");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSendCode = async () => {
    if (!validateForm()) return;
    try {
      // store should remember identifier for subsequent steps
      await resetPassword(identifier);
      // Pass identifier along to the next screen for convenience
      router.push({ pathname: "/auth/reset-password", params: { identifier } });
    } catch {
      // handled in store
    }
  };

  return (
    <AuthLayout>
      <Header title="Forgot Password" showBack />
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your email to receive a password reset link.
        </Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationError}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title="Send Reset Link"
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
    width: "100%",
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: "center",
  },
  sendButton: {
    marginTop: 32,
  },
});

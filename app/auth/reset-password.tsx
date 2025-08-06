import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Header from "@/components/Header";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const { updatePassword, isLoading, error } = useAuthStore() as any;

  const [identifier, setIdentifier] = useState(params.identifier || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    identifier: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      identifier: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!identifier) {
      errors.identifier = "Enter phone number or email";
    }
    if (!code || code.length < 4) {
      errors.code = "Enter the verification code sent to you";
    }
    if (!newPassword) {
      errors.newPassword = "Please enter a new password";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return (
      !errors.identifier &&
      !errors.code &&
      !errors.newPassword &&
      !errors.confirmPassword
    );
  };

  const handleSavePassword = async () => {
    if (!validateForm()) return;
    try {
      // Stash identifier/code in store so updatePassword can read them (per store partialize we persist)
      (useAuthStore as any).setState({
        resetIdentifier: identifier,
        resetCode: code,
      });
      await updatePassword(newPassword);
      router.replace("/auth/login");
    } catch {
      // handled in store
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Reset Password" showBack />

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter the verification code and your new password.
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="Email or Phone"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationErrors.identifier}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            error={validationErrors.code}
            autoCapitalize="none"
            keyboardType="number-pad"
          />
          <Input
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            error={validationErrors.newPassword}
            isPassword
          />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={validationErrors.confirmPassword}
            isPassword
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Save Password"
          onPress={handleSavePassword}
          loading={isLoading}
          style={styles.saveButton}
        />
      </View>
    </View>
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
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: "center",
  },
  saveButton: {
    marginTop: 32,
  },
});

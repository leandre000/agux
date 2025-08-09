import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const { updatePassword, isLoading, error } = useAuthStore() as any;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      newPassword: "",
      confirmPassword: "",
    };

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
    return !errors.newPassword && !errors.confirmPassword;
  };

  const handleSavePassword = async () => {
    if (!validateForm()) return;
    try {
      // Update password logic here
      await updatePassword(newPassword);
      router.replace("/auth/login");
    } catch {
      // handled in store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Reset Password" showBack />

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter the new password for your account
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            error={validationErrors.newPassword}
            isPassword
            style={styles.input}
          />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={validationErrors.confirmPassword}
            isPassword
            style={styles.input}
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
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 32,
    lineHeight: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
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
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#E6007E",
    borderRadius: 25,
    paddingVertical: 16,
  },
});
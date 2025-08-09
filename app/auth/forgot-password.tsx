import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Forgot Password" showBack />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your phone number or email to receive the{"\n"}resettion code for account recovery
        </Text>
        
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone Number or Gmail"
            value={identifier}
            onChangeText={setIdentifier}
            error={validationError}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <Button
          title="Send Verification Code"
          onPress={handleSendCode}
          loading={isLoading}
          style={styles.sendButton}
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
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  sendButton: {
    backgroundColor: "#E6007E",
    borderRadius: 25,
    paddingVertical: 16,
  },
});
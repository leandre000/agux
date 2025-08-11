import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useFormValidation, commonValidations } from "@/hooks/useFormValidation";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordValidationSchema = {
  newPassword: commonValidations.password,
  confirmPassword: commonValidations.confirmPassword,
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { updatePassword, isLoading } = useAuthStore() as any;

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<ResetPasswordFormValues>(
    {
      newPassword: "",
      confirmPassword: "",
    },
    resetPasswordValidationSchema,
    async (values) => {
      try {
        // Update password logic here
        await updatePassword(values.newPassword);
        router.replace("/auth/login");
      } catch {
        // handled in store
      }
    }
  );

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
            value={getFieldValue('newPassword')}
            onChangeText={(text) => setFieldValue('newPassword', text)}
            onBlur={() => setFieldTouched('newPassword')}
            error={getFieldError('newPassword')}
            secureTextEntry
            style={styles.input}
          />
          <Input
            placeholder="Confirm Password"
            value={getFieldValue('confirmPassword')}
            onChangeText={(text) => setFieldValue('confirmPassword', text)}
            onBlur={() => setFieldTouched('confirmPassword')}
            error={getFieldError('confirmPassword')}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Button
          title="Save Password"
          onPress={formik.handleSubmit}
          loading={isSubmitting || isLoading}
          style={styles.saveButton}
          disabled={!formik.isValid || !formik.dirty}
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
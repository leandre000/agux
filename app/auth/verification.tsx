import Button from '@/components/Button';
import Header from '@/components/Header';
import VerificationInput from '@/components/VerificationInput';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useFormValidation, commonValidations } from '@/hooks/useFormValidation';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';

interface VerificationFormValues {
  code: string;
}

const verificationValidationSchema = {
  code: Yup.string()
    .length(5, 'Verification code must be exactly 5 characters')
    .required('Verification code is required'),
};

export default function VerificationScreen() {
  const router = useRouter();
  const { verifyAccount, isLoading } = useAuthStore();

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<VerificationFormValues>(
    {
      code: '',
    },
    verificationValidationSchema,
    async (values) => {
      try {
        await verifyAccount(values.code);
        router.push('/profile/setup');
      } catch {
        // Error is handled in the store
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Account Verification" showBack />

      <View style={styles.content}>
        <Text style={styles.description}>
          We have sent verification code on your email or{"\n"}phone use it to activate your account
        </Text>

        <VerificationInput
          length={5}
          onCodeFilled={(code) => setFieldValue('code', code)}
        />

        <Button
          title="Verify Account"
          onPress={formik.handleSubmit}
          loading={isSubmitting || isLoading}
          style={styles.verifyButton}
          disabled={!formik.isValid || !formik.dirty}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 32,
    width: '100%',
    backgroundColor: '#E6007E',
    borderRadius: 25,
    paddingVertical: 16,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { updatePassword, isLoading, error } = useAuthStore();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const errors = {
      newPassword: '',
      confirmPassword: '',
    };
    
    if (!newPassword) {
      errors.newPassword = 'Please enter a new password';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return !errors.newPassword && !errors.confirmPassword;
  };

  const handleSavePassword = async () => {
    if (!validateForm()) return;
    
    try {
      await updatePassword(newPassword);
      router.replace('/auth/verification');
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Forgot Password" showBack />
      
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
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 32,
  },
});
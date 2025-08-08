import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!currentPassword) {
      errors.currentPassword = 'Please enter your current password';
    }

    if (!newPassword) {
      errors.newPassword = 'Please enter a new password';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    } else if (newPassword === currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Your password has been updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: Colors.textSecondary, text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const colors = [Colors.error, '#FFA500', '#FFD700', '#90EE90', Colors.primary];
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      strength: Math.min(strength, 4),
      color: colors[strength],
      text: texts[strength],
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Lock size={20} color={Colors.primary} />
            <Text style={styles.securityText}>
              For security reasons, you'll need to enter your current password to change it.
            </Text>
          </View>

          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <Input
                placeholder="Enter your current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                error={validationErrors.currentPassword}
                secureTextEntry={!showCurrentPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordContainer}>
              <Input
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={setNewPassword}
                error={validationErrors.newPassword}
                secureTextEntry={!showNewPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.strengthSegment,
                        {
                          backgroundColor: index <= passwordStrength.strength 
                            ? passwordStrength.color 
                            : Colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <Input
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={validationErrors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Text style={[styles.requirementText, newPassword.length >= 8 && styles.requirementMet]}>
                • At least 8 characters long
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={[styles.requirementText, /[a-z]/.test(newPassword) && styles.requirementMet]}>
                • Contains lowercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={[styles.requirementText, /[A-Z]/.test(newPassword) && styles.requirementMet]}>
                • Contains uppercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={[styles.requirementText, /\d/.test(newPassword) && styles.requirementMet]}>
                • Contains number
              </Text>
            </View>
          </View>

          {/* Update Button */}
          <Button
            title={isLoading ? 'Updating Password...' : 'Update Password'}
            onPress={handleChangePassword}
            disabled={isLoading}
            style={styles.updateButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  securityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: {
    flexDirection: 'row',
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginRight: 12,
  },
  strengthSegment: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
  },
  requirementsContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  requirementItem: {
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  requirementMet: {
    color: Colors.primary,
    fontWeight: '500',
  },
  updateButton: {
    marginTop: 8,
  },
}); 
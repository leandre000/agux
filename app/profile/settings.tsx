import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, Globe, Lock, Palette, Shield, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showChevron?: boolean;
}

const SettingOption: React.FC<SettingOptionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  showChevron = true 
}) => (
  <TouchableOpacity 
    style={styles.optionContainer} 
    onPress={onPress} 
    activeOpacity={0.7}
    disabled={showSwitch}
  >
    <View style={styles.optionIconContainer}>
      {icon}
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    {showSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={switchValue ? Colors.text : Colors.textSecondary}
      />
    ) : showChevron && (
      <ChevronLeft size={20} color={Colors.textSecondary} style={styles.chevron} />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSave = () => {
    updateUser({ username, email });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted successfully');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.username || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsContainer}>
            <SettingOption
              icon={<User size={24} color={Colors.text} />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => setIsEditing(true)}
            />
            <SettingOption
              icon={<Lock size={24} color={Colors.text} />}
              title="Change Password"
              subtitle="Update your password"
              onPress={() => router.push('/profile/change-password')}
            />
            <SettingOption
              icon={<Shield size={24} color={Colors.text} />}
              title="Privacy Settings"
              subtitle="Manage your privacy preferences"
              onPress={() => router.push('/profile/privacy')}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.optionsContainer}>
            <SettingOption
              icon={<Bell size={24} color={Colors.text} />}
              title="Push Notifications"
              subtitle="Receive notifications about events"
              showSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
              showChevron={false}
            />
            <SettingOption
              icon={<Palette size={24} color={Colors.text} />}
              title="Dark Mode"
              subtitle="Use dark theme"
              showSwitch
              switchValue={darkModeEnabled}
              onSwitchChange={setDarkModeEnabled}
              showChevron={false}
            />
            <SettingOption
              icon={<Globe size={24} color={Colors.text} />}
              title="Language"
              subtitle="English"
              onPress={() => router.push('/profile/language')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionContainer, styles.dangerOption]} 
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Text style={styles.dangerIcon}>🗑️</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.dangerText}>Delete Account</Text>
                <Text style={styles.optionSubtitle}>Permanently delete your account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {isEditing && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSave}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dangerOption: {
    borderBottomWidth: 0,
  },
  optionIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '500',
  },
  dangerIcon: {
    fontSize: 20,
  },
  chevron: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 
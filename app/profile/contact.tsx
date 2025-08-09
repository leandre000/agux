import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, User, Settings, HelpCircle, Phone, LogOut } from 'lucide-react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { Alert } from 'react-native';

interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ 
  icon, 
  title, 
  onPress, 
  showChevron = true,
  destructive = false 
}) => (
  <TouchableOpacity style={styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.optionIconContainer, destructive && styles.destructiveIconContainer]}>
      {icon}
    </View>
    <Text style={[styles.optionTitle, destructive && styles.destructiveText]}>{title}</Text>
    {showChevron && !destructive && <Text style={styles.chevron}>›</Text>}
  </TouchableOpacity>
);

export default function ProfileWithLogoutScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Mock user data (would come from backend)
  const userData = {
    name: user?.username || 'Donye Collins',
    email: user?.email || 'iamcollinsdonye@gmail.com',
    profileImage: user?.profileImage || require('@/assets/images/profile.jpg'),
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleMyAccount = () => router.push('/profile/setup');
  const handleSettings = () => router.push('/profile/settings');
  const handleHelpCenter = () => router.push('/profile/help-support');
  const handleContact = () => {
    // This is the contact screen, so we can show contact info or go back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Profile</Text>
          <TouchableOpacity>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={userData.profileImage}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <ProfileOption
            icon={<User size={24} color={Colors.text} />}
            title="My Account"
            onPress={handleMyAccount}
          />

          <ProfileOption
            icon={<Settings size={24} color={Colors.text} />}
            title="Settings"
            onPress={handleSettings}
          />

          <ProfileOption
            icon={<HelpCircle size={24} color={Colors.text} />}
            title="Help Center"
            onPress={handleHelpCenter}
          />

          <ProfileOption
            icon={<Phone size={24} color={Colors.text} />}
            title="Contact"
            onPress={handleContact}
          />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  editProfileText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
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
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  optionsContainer: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIconContainer: {
    backgroundColor: Colors.error,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  destructiveText: {
    color: Colors.error,
  },
  chevron: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '300',
  },
  logoutContainer: {
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

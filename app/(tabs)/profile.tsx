import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, CreditCard, HelpCircle, LogOut, Settings } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = true,
  destructive = false 
}) => (
  <TouchableOpacity style={styles.optionContainer} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.optionIconContainer}>
      {icon}
    </View>
    <View style={styles.optionContent}>
      <Text style={[styles.optionTitle, destructive && styles.destructiveText]}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    {showChevron && <ChevronRight size={20} color={Colors.textSecondary} />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

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

  const handleSettings = () => router.push('/profile/settings');
  const handlePaymentMethods = () => router.push('/profile/payment-methods');
  const handleNotifications = () => router.push('/profile/notifications');
  const handleHelpSupport = () => router.push('/profile/help-support');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' }}
            style={styles.profileImage}
          />

          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>{user?.email || user?.phone || ''}</Text>

          <View style={styles.categoriesContainer}>
            {user?.categories?.map((category) => (
              <View key={category} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <ProfileOption
            icon={<Settings size={24} color={Colors.text} />}
            title="Account Settings"
            subtitle="Manage your profile and preferences"
            onPress={handleSettings}
          />

          <ProfileOption
            icon={<CreditCard size={24} color={Colors.text} />}
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={handlePaymentMethods}
          />

          <ProfileOption
            icon={<Bell size={24} color={Colors.text} />}
            title="Notifications"
            subtitle="Configure notification preferences"
            onPress={handleNotifications}
          />

          <ProfileOption
            icon={<HelpCircle size={24} color={Colors.text} />}
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelpSupport}
          />

          <View style={styles.separator} />

          <ProfileOption
            icon={<LogOut size={24} color={Colors.error} />}
            title="Logout"
            onPress={handleLogout}
            destructive
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 4,
  },
  categoryText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  destructiveText: {
    color: Colors.error,
  },
  separator: {
    height: 20,
  },
});

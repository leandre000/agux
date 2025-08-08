import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, CreditCard, Bell, HelpCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';


interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
    <View style={styles.optionIconContainer}>
      {icon}
    </View>
    <Text style={styles.optionTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    
    router.push('/onboarding');
  };

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
            onPress={() => {}}
          />

          <ProfileOption
            icon={<CreditCard size={24} color={Colors.text} />}
            title="Payment Methods"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<Bell size={24} color={Colors.text} />}
            title="Notifications"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<HelpCircle size={24} color={Colors.text} />}
            title="Help & Support"
            onPress={() => {}}
          />

          <ProfileOption
            icon={<LogOut size={24} color={Colors.error} />}
            title="Logout"
            onPress={handleLogout}
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
  optionTitle: {
    fontSize: 16,
    color: Colors.text,
  },
});

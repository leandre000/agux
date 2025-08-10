import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { Heart, HelpCircle, LogOut, Settings, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      icon: <User size={24} color={Colors.text} />,
      title: 'Personal Information',
      onPress: () => router.push('/profile/settings'),
    },
    {
      icon: <Heart size={24} color={Colors.text} />,
      title: 'My Categories',
      onPress: () => router.push('/profile/settings'),
    },
    {
      icon: <Settings size={24} color={Colors.text} />,
      title: 'Settings',
      onPress: () => router.push('/profile/settings'),
    },
    {
      icon: <HelpCircle size={24} color={Colors.text} />,
      title: 'Help & Support',
      onPress: () => router.push('/profile/help-support'),
    },
    {
      icon: <Shield size={24} color={Colors.text} />,
      title: 'Privacy & Security',
      onPress: () => router.push('/profile/settings'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.profileImage || 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.username || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color={Colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
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
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  menuItemArrow: {
    color: Colors.textSecondary,
    fontSize: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

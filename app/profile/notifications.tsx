import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';

interface NotificationSettingProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({ 
  title, 
  value, 
  onValueChange 
}) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingTitle}>{title}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#3C3C3E', true: Colors.primary }}
      thumbColor={value ? '#fff' : '#f4f3f4'}
      ios_backgroundColor="#3C3C3E"
    />
  </View>
);

export default function NotificationSettingsScreen() {
  const router = useRouter();
  
  // Notification settings state
  const [eventAlert, setEventAlert] = useState(true);
  const [ordersAlert, setOrdersAlert] = useState(false);
  const [sortEventsAlert, setSortEventsAlert] = useState(false);

  // Save notification settings to backend/storage
  console.log('Notification settings:', {
    eventAlert,
    ordersAlert,
    sortEventsAlert,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Notification Settings</Text>
        </View>

        <View style={styles.settingsContainer}>
          <NotificationSetting
            title="Event alert"
            value={eventAlert}
            onValueChange={setEventAlert}
          />
          
          <NotificationSetting
            title="Orders alert"
            value={ordersAlert}
            onValueChange={setOrdersAlert}
          />
          
          <NotificationSetting
            title="Sort Events alert"
            value={sortEventsAlert}
            onValueChange={setSortEventsAlert}
          />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
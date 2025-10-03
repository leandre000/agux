import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Notifications" showBack />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Notifications</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>SMS Notifications</Text>
          <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Promotions & Offers</Text>
          <Switch value={promotionsEnabled} onValueChange={setPromotionsEnabled} />
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
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
});

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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
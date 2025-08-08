import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Bell, Calendar, ChevronLeft, CreditCard, MessageCircle, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationSetting {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'general' | 'events' | 'payments' | 'marketing';
}

interface NotificationSectionProps {
  title: string;
  settings: NotificationSetting[];
  onToggle: (id: string, value: boolean) => void;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({ 
  title, 
  settings, 
  onToggle 
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.settingsContainer}>
      {settings.map((setting) => (
        <View key={setting.id} style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            {setting.icon}
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
          </View>
          <Switch
            value={setting.enabled}
            onValueChange={(value) => onToggle(setting.id, value)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={setting.enabled ? Colors.text : Colors.textSecondary}
          />
        </View>
      ))}
    </View>
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'push_notifications',
      title: 'Push Notifications',
      subtitle: 'Receive notifications on your device',
      icon: <Bell size={24} color={Colors.text} />,
      enabled: true,
      category: 'general',
    },
    {
      id: 'event_reminders',
      title: 'Event Reminders',
      subtitle: 'Get reminded about upcoming events',
      icon: <Calendar size={24} color={Colors.text} />,
      enabled: true,
      category: 'events',
    },
    {
      id: 'event_updates',
      title: 'Event Updates',
      subtitle: 'Notifications about event changes',
      icon: <MessageCircle size={24} color={Colors.text} />,
      enabled: true,
      category: 'events',
    },
    {
      id: 'payment_notifications',
      title: 'Payment Notifications',
      subtitle: 'Updates about your payments',
      icon: <CreditCard size={24} color={Colors.text} />,
      enabled: true,
      category: 'payments',
    },
    {
      id: 'promotional_offers',
      title: 'Promotional Offers',
      subtitle: 'Special deals and discounts',
      icon: <Star size={24} color={Colors.text} />,
      enabled: false,
      category: 'marketing',
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      subtitle: 'Weekly updates and news',
      icon: <MessageCircle size={24} color={Colors.text} />,
      enabled: false,
      category: 'marketing',
    },
  ]);

  const handleToggleSetting = (id: string, value: boolean) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: value } : setting
      )
    );
  };

  const handleToggleAll = (category: string, value: boolean) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.category === category ? { ...setting, enabled: value } : setting
      )
    );
  };

  const generalSettings = notificationSettings.filter(s => s.category === 'general');
  const eventSettings = notificationSettings.filter(s => s.category === 'events');
  const paymentSettings = notificationSettings.filter(s => s.category === 'payments');
  const marketingSettings = notificationSettings.filter(s => s.category === 'marketing');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleToggleAll('events', true)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionText}>Enable All Events</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleToggleAll('marketing', false)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionText}>Disable Marketing</Text>
            </TouchableOpacity>
          </View>

          {/* General Notifications */}
          <NotificationSection
            title="General"
            settings={generalSettings}
            onToggle={handleToggleSetting}
          />

          {/* Event Notifications */}
          <NotificationSection
            title="Events"
            settings={eventSettings}
            onToggle={handleToggleSetting}
          />

          {/* Payment Notifications */}
          <NotificationSection
            title="Payments"
            settings={paymentSettings}
            onToggle={handleToggleSetting}
          />

          {/* Marketing Notifications */}
          <NotificationSection
            title="Marketing"
            settings={marketingSettings}
            onToggle={handleToggleSetting}
          />

          {/* Notification Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Schedule</Text>
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingIconContainer}>
                  <Calendar size={24} color={Colors.text} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Quiet Hours</Text>
                  <Text style={styles.settingSubtitle}>10:00 PM - 8:00 AM</Text>
                </View>
                <ChevronLeft size={20} color={Colors.textSecondary} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>💡 Notification Tips</Text>
            <Text style={styles.infoText}>
              • Enable event reminders to never miss your favorite events{'\n'}
              • Payment notifications help you track your transactions{'\n'}
              • You can customize quiet hours in your device settings
            </Text>
          </View>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  settingsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    transform: [{ rotate: '180deg' }],
  },
  infoSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
}); 
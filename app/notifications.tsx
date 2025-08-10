import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'order_success' | 'event_reminder' | 'promotion';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_success':
        return '✓';
      case 'event_reminder':
        return '📅';
      case 'promotion':
        return '🎉';
      default:
        return '📱';
    }
  };

  return (
    <TouchableOpacity style={styles.notificationItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.notificationIcon}>
        <Text style={styles.iconText}>{getNotificationIcon(notification.type)}</Text>
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        
        {notification.actionText && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{notification.actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{formatTime(notification.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock notifications data (would come from backend)
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'order_success',
      title: 'Successfully Order',
      message: 'Your order has been successfully made',
      timestamp: new Date(), // Today
      isRead: false,
      actionText: 'View Now',
      actionUrl: '/orders/1'
    },
    {
      id: '2',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '3',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '4',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '5',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '6',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '7',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '8',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
  ];

  const loadNotifications = async () => {
    try {
      // In real app, fetch from API
      // const data = await NotificationsAPI.getNotifications();
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications(mockNotifications);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read and navigate if needed
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const isToday = (date: Date) => {
      return date.toDateString() === today.toDateString();
    };
    
    const isYesterday = (date: Date) => {
      return date.toDateString() === yesterday.toDateString();
    };

    const todayNotifications = notifications.filter(n => isToday(n.timestamp));
    const yesterdayNotifications = notifications.filter(n => isYesterday(n.timestamp));
    const olderNotifications = notifications.filter(n => !isToday(n.timestamp) && !isYesterday(n.timestamp));

    return {
      today: todayNotifications,
      yesterday: yesterdayNotifications,
      older: olderNotifications
    };
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.notificationGroup} key={title}>
        <Text style={styles.groupTitle}>{title}</Text>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Notifications</Text>
        </View>

        <View style={styles.notificationsContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.text}
              />
            }
          >
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('Older', groupedNotifications.older)}
            
            {notifications.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No notifications yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  You&apos;ll see your notifications here when you have some
                </Text>
              </View>
            )}
          </ScrollView>
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
    marginBottom: 24,
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
  notificationsContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notificationGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
    paddingRight: 12,
  },
  notificationTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  timestampContainer: {
    justifyContent: 'center',
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

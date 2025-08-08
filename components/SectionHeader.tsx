import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  route?: string; 
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showSeeAll = true,
  onSeeAllPress,
  route,
}) => {
  const router = useRouter();

  const handleSeeAllPress = () => {
    if (onSeeAllPress) {
      onSeeAllPress();
    } else if (route) {
      try {
        // 👇 Bypass type check safely will use it later
        router.push(route as any);
      } catch (error) {
        console.warn(`Navigation failed for route "${route}":`, error);
        Alert.alert('Navigation Error', `Could not navigate to "${route}"`);
      }
    } else {
      console.warn('No valid route or handler provided to SectionHeader.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default SectionHeader;

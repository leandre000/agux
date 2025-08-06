import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useEventsStore } from '@/store/events-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Header from '@/components/Header';
import CategoryButton from '@/components/CategoryButton';
import AuthLayout from '@/components/AuthLayout';

import { EventCategory } from '@/mocks/events';

const categories: EventCategory[] = [
  'Sports',
  'Art',
  'Music',
  'Tech',
  'Culture',
  'Film',
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const { setSelectedCategories } = useEventsStore();

  const [selectedCategories, setSelected] = useState<EventCategory[]>([]);

  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      setSelected(selectedCategories.filter(c => c !== category));
    } else {
      setSelected([...selectedCategories, category]);
    }
  };

  const handleSave = () => {
    updateUser({ categories: selectedCategories });
    setSelectedCategories(selectedCategories);
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout>
      <Header title="Event Categories" showBack />
      <View style={styles.content}>
        <Text style={styles.description}>
          Select the most event categories that interest you
        </Text>
        <View style={styles.pyramidContainer}>
          <View style={styles.row}>
            <CategoryButton
              category={categories[0]} // Sports
              selected={selectedCategories.includes(categories[0])}
              onPress={() => toggleCategory(categories[0])}
              style={styles.categoryCircle}
            />
          </View>
          <View style={styles.row}>
            <CategoryButton
              category={categories[1]} // Art
              selected={selectedCategories.includes(categories[1])}
              onPress={() => toggleCategory(categories[1])}
              style={styles.categoryCircle}
            />
            <View style={{ width: 72 }} />
            <CategoryButton
              category={categories[2]} // Music
              selected={selectedCategories.includes(categories[2])}
              onPress={() => toggleCategory(categories[2])}
              style={styles.categoryCircle}
            />
          </View>
          <View style={styles.row}>
            <CategoryButton
              category={categories[3]} // Tech
              selected={selectedCategories.includes(categories[3])}
              onPress={() => toggleCategory(categories[3])}
              style={styles.categoryCircle}
            />
          </View>
          <View style={styles.row}>
            <CategoryButton
              category={categories[4]} // Culture
              selected={selectedCategories.includes(categories[4])}
              onPress={() => toggleCategory(categories[4])}
              style={styles.categoryCircle}
            />
            <View style={{ width: 72 }} />
            <CategoryButton
              category={categories[5]} // Film
              selected={selectedCategories.includes(categories[5])}
              onPress={() => toggleCategory(categories[5])}
              style={styles.categoryCircle}
            />
          </View>
        </View>
        <Button
          title="Save Information"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  pyramidContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginHorizontal: 18,
    marginVertical: 0,
  },
  saveButton: {
    width: '100%',
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    paddingVertical: 12,
  },
});

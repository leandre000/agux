import Button from '@/components/Button';
import CategoryButton from '@/components/CategoryButton';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { useEventsStore } from '@/store/events-store';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
    setSelectedCategories(selectedCategories as any);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 32,
    textAlign: 'center',
  },
  pyramidContainer: {
    alignItems: 'center',
    marginBottom: 32,
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    marginVertical: 0,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    borderRadius: 25,
    backgroundColor: '#E6007E',
    alignSelf: 'center',
    paddingVertical: 16,
  },
});
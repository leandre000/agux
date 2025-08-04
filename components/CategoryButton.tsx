import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { EventCategory } from '@/mocks/events';

interface CategoryButtonProps {
  category: EventCategory;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle; 
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        style, 
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  text: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.text,
    fontWeight: '600',
  },
});

export default CategoryButton;

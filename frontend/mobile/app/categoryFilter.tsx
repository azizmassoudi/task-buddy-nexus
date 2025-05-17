import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ServiceCategory, getAllCategories } from '../src/data/mockServices';

interface CategoryFilterProps {
  selectedCategory: ServiceCategory | null;
  onSelectCategory: (category: ServiceCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = getAllCategories();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          style={[
            styles.button,
            selectedCategory === null ? styles.buttonSelected : styles.buttonUnselected
          ]}
        >
          <Text style={selectedCategory === null ? styles.textSelected : styles.textUnselected}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            style={[
              styles.button,
              selectedCategory === category ? styles.buttonSelected : styles.buttonUnselected
            ]}
          >
            <Text style={selectedCategory === category ? styles.textSelected : styles.textUnselected}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a202c',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  buttonSelected: {
    backgroundColor: '#9980F2', // brand-300
  },
  buttonUnselected: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  textSelected: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  textUnselected: {
    color: '#374151', // gray-700
    fontWeight: '500',
    fontSize: 14,
  },
});

export default CategoryFilter;

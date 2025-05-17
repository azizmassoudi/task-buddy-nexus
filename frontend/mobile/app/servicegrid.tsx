import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Service } from '../src/redux/types'; // Use the Redux Service type
import { ServiceCard } from './servicecard';

interface ServiceGridProps {
  services: Service[];
  onServicePress?: (service: Service) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, onServicePress }) => {
  const numColumns = 2;
  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id?.toString() ?? String(Math.random())}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ServiceCard service={item} onPress={onServicePress ? () => onServicePress(item) : undefined} />
        </View>
      )}
      contentContainerStyle={styles.container}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      key={numColumns}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  cardWrapper: {
    flex: 0.5, // Allow two columns
    marginBottom: 12,
    paddingHorizontal: 4, // Add horizontal padding for spacing
  },
});

export default ServiceGrid;
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Service } from '../src/data/mockServices';
import { getImageUrl } from './utils';
import { useRouter } from 'expo-router';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.82:8000';
  const router = useRouter();
  const handlePress = () => {
    router.push({ pathname: '/servicedetailpage', params: { id: service.id } });
  };

  const fallbackImage = require('../assets/images/icon.png'); 

  const imageSource =
    service.imageUrl
      ? { uri: getImageUrl(service.imageUrl, backendUrl) }
      : fallbackImage;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress || handlePress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onError={() => {}}
        />
        <View
          style={[
            styles.statusBadge,
            service.status === 'Open' ? styles.statusOpen : styles.statusClosed,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              service.status === 'Open' ? styles.statusTextOpen : styles.statusTextClosed,
            ]}
          >
            {service.status}
          </Text>
        </View>
      </View>

      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{service.category}</Text>
      </View>


      <View style={styles.row}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.price}>${service.price}</Text>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusOpen: {
    backgroundColor: '#9980F2',
  },
  statusClosed: {
    backgroundColor: '#e5e7eb',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextOpen: {
    color: '#fff',
  },
  statusTextClosed: {
    color: '#374151',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  categoryText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#9980F2',
    fontWeight: '600',
    fontSize: 16,
  },
  location: {
    color: '#6b7280',
    fontSize: 13,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  skillBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  skillText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ServiceCard;

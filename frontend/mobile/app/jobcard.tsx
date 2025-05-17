import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Modal, Dimensions } from "react-native";
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { getImageUrl } from './utils';
import { userAPI } from '../src/lib/api';

interface JobCardProps {
  job: {
    title: string;
    description: string;
    budget: number;
    status: string;
    freelancer_id?: number | null;
  };
  service: any;
}

export const JobCard: React.FC<JobCardProps> = ({ job, service }) => {
  const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.82:8000';
  const imageSource = service?.imageUrl
    ? { uri: getImageUrl(service.imageUrl, backendUrl) }
    : require('../assets/images/icon.png');

  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (job.freelancer_id) {
      userAPI.getUserById(job.freelancer_id.toString())
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [job.freelancer_id]);

  return (
    <>
      <Pressable onLongPress={handleLongPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.statusBadge, job.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
            <Text style={[styles.statusText, job.status === 'Open' ? styles.statusTextOpen : styles.statusTextClosed]}>
              {job.status}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <View style={[
            styles.modalCard,
            {
              width: screenWidth * 0.9,
              alignSelf: 'center',
              marginTop: 40,
              marginBottom: 0,
            },
          ]}>
            <View style={styles.imageContainer}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={[styles.statusBadge, job.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
                <Text style={[styles.statusText, job.status === 'Open' ? styles.statusTextOpen : styles.statusTextClosed]}>
                  {job.status}
                </Text>
              </View>
            </View>
            {service?.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.price}>${job.budget}</Text>
            </View>
            <Text style={styles.description}>{job.description}</Text>
            {service?.location && (
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.location}>{service.location}</Text>
              </View>
            )}
            {user && (
              <View style={styles.userRow}>
                <Text style={styles.subcontractorLabel}>Subcontractor:</Text>
                <Text style={styles.subcontractor}>{user.full_name || 'N/A'}</Text>
                <Text style={styles.subcontractorEmail}>{user.email}</Text>
              </View>
            )}
            {service?.skills && Array.isArray(service.skills) && service.skills.length > 0 && (
              <View style={styles.skillsContainer}>
                {service.skills.map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
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
    fontSize: 17,
    fontWeight: '700',
    color: '#22223b',
    marginBottom: 2,
    flex: 1,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    color: '#7c3aed',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationIcon: {
    fontSize: 13,
    marginRight: 2,
  },
  location: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
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
  userRow: {
    flexDirection: 'column',
    marginTop: 6,
    marginBottom: 2,
  },
  subcontractorLabel: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  subcontractor: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
  },
  subcontractorEmail: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignSelf: 'center',
    marginTop: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default JobCard;
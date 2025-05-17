import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceById, clearCurrentService } from '../src/redux/slices/servicesSlice';
import { RootState, AppDispatch } from '../src/redux/store';
import { getImageUrl } from './utils';
import RequestForm from './requestform';


const fallbackImage = require('../assets/images/icon.png'); // Use a local image in your assets

const ServiceDetailPage = () => {
  const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.82:8000';
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentService: service, loading, error } = useSelector((state: RootState) => state.services);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [message, setMessage] = useState('');
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const imageSource =
    service?.imageUrl
      ? { uri: getImageUrl(service.imageUrl, backendUrl) }
      : fallbackImage;

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9980F2" />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading service</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Services')}>
          <Text style={styles.backButtonText}>Back to Services</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>Service Not Found</Text>
        <Text style={styles.notFoundDescription}>
          The service you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Services')}>
          <Text style={styles.backButtonText}>Browse All Services</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use all possible field names for compatibility
  const formattedDate = new Date((service.postedDate || service.created_at || service.createdAt)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleHire = () => {
    Alert.alert('Request Sent', 'Your request for this service has been submitted.');
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    Alert.alert('Message Sent', 'Your message has been sent.');
    setMessage('');
  };

  const handleEditService = () => {
    router.push({
      pathname: '/manageservices',
      params: { id }
    });
  };

  const handleDeleteService = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Service Deleted', 'The service has been successfully deleted.');
            router.push('/Services');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/Services')}>
        <Text style={styles.backLink}>← Back to Services</Text>
      </TouchableOpacity>
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>{service.category}</Text>
        <Text style={[styles.badge, service.status === 'Open' ? styles.badgeOpen : styles.badgeOther]}>
          {service.status}
        </Text>
      </View>
      <Text style={styles.title}>{service.title}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Posted on {formattedDate}</Text>
        <Text style={styles.infoText}>{service.location || ''}</Text>
        <Text style={styles.infoText}>{service.estimatedHours ?? ''} hours</Text>
        <Text style={styles.priceText}>${service.price}</Text>
      </View>
      <View style={styles.imageContainer}>
        {service.imageUrl ? (
          <Image
            source={{ uri: getImageUrl(service.imageUrl, backendUrl) || undefined }}
            style={styles.image}
            resizeMode="cover"
            defaultSource={fallbackImage}
          />
        ) : (
          <Image source={fallbackImage} style={styles.image} resizeMode="cover" />
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{service.description}</Text>
        {(service.skills && service.skills.length > 0) ? (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>Required Skills</Text>
            <View style={styles.skillsRow}>
              {service.skills.map((skill: string, idx: number) => (
                <Text key={idx} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Actions</Text>
        {!isAuthenticated && (
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/Login')}>
            <Text style={styles.actionButtonText}>Login to Continue</Text>
          </TouchableOpacity>
        )}
        {isAuthenticated && user && user.role === 'client' && (
          <TouchableOpacity
            style={[styles.actionButton, service.status !== 'Open' && styles.disabledButton]}
            onPress={handleHire}
            disabled={service.status !== 'Open'}
          >
            <Text style={styles.actionButtonText}>Request This Service</Text>
          </TouchableOpacity>
        )}
        {isAuthenticated && user && user.role === 'subcontractor' && (
          <TouchableOpacity
            style={[styles.actionButton, service.status !== 'Open' && styles.disabledButton]}
            onPress={() => setIsRequestFormOpen(true)}
            disabled={service.status !== 'Open'}
          >
            <Text style={styles.actionButtonText}>Bid on This Job</Text>
          </TouchableOpacity>
        )}
        {isAuthenticated && user && user.role === 'admin' && (
          <View>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditService}>
              <Text style={styles.actionButtonText}>Edit Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteService}>
              <Text style={styles.deleteButtonText}>Delete Service</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isAuthenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionText}>Send a message about this service</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Write your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* RequestForm modal or component */}
      {isRequestFormOpen && (
        <RequestForm
          isOpen={isRequestFormOpen}
          onOpenChange={setIsRequestFormOpen}
          id={Number(id)}
          service={service}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#111827' },
  errorText: { fontSize: 18, color: 'red', fontWeight: 'bold' },
  errorDescription: { color: '#6b7280', marginVertical: 8 },
  notFoundTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  notFoundDescription: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  backButton: { backgroundColor: '#93c5fd', borderRadius: 8, padding: 12, marginTop: 12 },
  backButtonText: { color: '#1e3a8a', fontWeight: 'bold', textAlign: 'center' },
  backLink: { color: '#9980F2', marginBottom: 12, fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  badge: { backgroundColor: '#e5e7eb', color: '#111827', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, fontSize: 13 },
  badgeOpen: { backgroundColor: '#bbf7d0', color: '#166534' },
  badgeOther: { backgroundColor: '#fca5a5', color: '#991b1b' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  infoText: { color: '#6b7280', marginRight: 16, fontSize: 14 },
  priceText: { color: '#9980F2', fontWeight: 'bold', fontSize: 16 },
  imageContainer: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#f3f4f6', marginBottom: 16, height: 200, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  sectionText: { color: '#374151', fontSize: 15, marginBottom: 8 },
  skillsSection: { marginTop: 12 },
  skillsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#e5e7eb', color: '#111827', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 4, fontSize: 13 },
  actionButton: { backgroundColor: '#9980F2', borderRadius: 8, padding: 12, marginTop: 12, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#fee2e2', borderRadius: 8, padding: 12, marginTop: 8, alignItems: 'center' },
  deleteButtonText: { color: '#dc2626', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#d1d5db' },
  textarea: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, minHeight: 80, marginTop: 8, marginBottom: 8, textAlignVertical: 'top' },
});

export default ServiceDetailPage;
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import { fetchServices } from '../src/redux/slices/servicesSlice';
import { useNavigation } from '@react-navigation/native';
import ServiceGrid from './servicegrid';
import ServiceForm from './serviceform';
import { ServiceCategory } from '@/src/data/mockServices';

const Services = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, loading, error } = useSelector((state: RootState) => state.services);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleCreateButtonClick = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to create a service.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
        ]
      );
      return;
    }
    setIsHidden(!isHidden);
  };

  // Header for the page
  const renderHeader = () => (
    <>
      <View style={styles.createRow}>
        {!isHidden && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateButtonClick}>
            <Text style={styles.createButtonText}>+ Create Service</Text>
          </TouchableOpacity>
        )}
        {isHidden && <ServiceForm onSubmit={function (data: { title: string; description: string; price: string; location: string; category: ServiceCategory; }): void {
          throw new Error('Function not implemented.');
        }} />}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Services</Text>
        <Text style={styles.cardDescription}>View and manage your existing services.</Text>
      </View>
    </>
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.cardContent}>
      {loading ? (
        <ActivityIndicator size="large" color="#9980F2" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.errorText}>No services found.</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {renderHeader()}
      {services.length === 0 ? (
        renderEmpty()
      ) : (
        <ServiceGrid services={services} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 16 },
  createRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  createButton: {
    backgroundColor: '#9980F2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  cardDescription: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  cardContent: { marginTop: 8 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default Services;
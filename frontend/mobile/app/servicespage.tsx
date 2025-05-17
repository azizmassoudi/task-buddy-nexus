import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../src/redux/store';

import CategoryFilter  from './categoryFilter';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { fetchServices } from '../src/redux/slices/servicesSlice';
import ServiceGrid from './servicegrid';

const ServicesPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { services } = useSelector((state: RootState) => state.services);

  // Mock user object with a role property for demonstration
  const user: { role?: string } = { role: 'client' }; // Replace with actual user fetching logic
  const currentRole = user?.role || 'client';

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    let filtered = services;
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered = filtered.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    if (statusFilter !== 'All') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, priceRange, statusFilter, services]);

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setPriceRange([0, 5000]);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Services</Text>
        <Text style={styles.subtitle}>Find the perfect service for your needs</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#888"
        />
        {currentRole === 'admin' && (
          <TouchableOpacity
            style={styles.newServiceButton}
            onPress={() => navigation.navigate('NewService' as never)}
          >
            <Text style={styles.newServiceButtonText}>+ New Service</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Services</Text>
            <Text style={styles.modalLabel}>Status</Text>
            <Picker
              selectedValue={statusFilter}
              onValueChange={value => setStatusFilter(value)}
              style={styles.picker}
            >
              <Picker.Item label="All Statuses" value="All" />
              <Picker.Item label="Open" value="Open" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
            <Text style={styles.modalLabel}>Price Range</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>${priceRange[0]}</Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 10 }}
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={priceRange[0]}
                onValueChange={val => setPriceRange([val, priceRange[1]])}
              />
              <Text>${priceRange[1]}</Text>
            </View>
            <Slider
              style={{ marginVertical: 10 }}
              minimumValue={0}
              maximumValue={5000}
              step={50}
              value={priceRange[1]}
              onValueChange={val => setPriceRange([priceRange[0], val])}
            />
            <View style={styles.modalButtons}>
              <Button title="Reset Filters" onPress={resetFilters} />
              <Button title="Close" onPress={() => setFilterModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {filteredServices.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ServiceGrid services={filteredServices} />
        </View>
      ) : (
        <View style={styles.noServices}>
          <Text style={styles.noServicesText}>No services match your filters</Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Clear all filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { marginTop: 8, fontSize: 16, color: '#6b7280' },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  searchInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  newServiceButton: {
    backgroundColor: '#93c5fd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  newServiceButtonText: { color: '#1e3a8a', fontWeight: 'bold' },
  filterButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonText: { color: '#9980F2', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalLabel: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  picker: { width: '100%' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  noServices: { alignItems: 'center', padding: 32 },
  noServicesText: { fontSize: 16, color: '#6b7280' },
  clearFiltersText: { color: '#9980F2', marginTop: 8, fontWeight: 'bold' },
});

export default ServicesPage;

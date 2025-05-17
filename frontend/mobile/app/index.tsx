import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CategoryFilter } from './categoryFilter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { fetchServices } from '../src/redux/slices/servicesSlice';

import { Service } from '@/src/redux/types';
import ServiceGrid from './servicegrid';
import JobsGrid from './jobsgrid';
import { fetchJobs } from '@/src/redux/slices/jobsSlice';

const Index = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<any>(); // Fix type for navigation
  const dispatch = useDispatch<AppDispatch>();
  const { services } = useSelector((state: RootState) => state.services);
  const jobs = useSelector((state: RootState) => state.jobs.jobs); // Adjust if your jobs state is different
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchJobs()); // Fetch jobs if needed
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
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  // Compose all header content into a single component
  const renderHeader = () => (
    <>
      {/* Featured Services & Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        <Text style={styles.sectionSubtitle}>
          Browse our most popular service categories
        </Text>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
        {/* Service display directly under category filter */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={{ marginTop: 16 }}>
          {filteredServices.length > 0 ? (
            <ServiceGrid services={filteredServices} />
          ) : (
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 16 }}>No services found.</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate('services')}
        >
          <Text style={styles.outlineButtonText}>View All Services</Text>
        </TouchableOpacity>
      </View>
            <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jobs</Text>
        <JobsGrid jobs={jobs} />
      </View>
      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>
          Easy steps to get started with our platform
        </Text>
        <View style={styles.stepsContainer}>
          <View style={styles.stepBox}>
            <View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View>
            <Text style={styles.stepTitle}>Find a Service</Text>
            <Text style={styles.stepText}>
              Browse through our wide range of professional services or search for a specific service you need.
            </Text>
          </View>
          <View style={styles.stepBox}>
            <View style={styles.stepCircle}><Text style={styles.stepNumber}>2</Text></View>
            <Text style={styles.stepTitle}>Choose a Provider</Text>
            <Text style={styles.stepText}>
              Review profiles, ratings, and portfolios to find the right professional for your job.
            </Text>
          </View>
          <View style={styles.stepBox}>
            <View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View>
            <Text style={styles.stepTitle}>Get It Done</Text>
            <Text style={styles.stepText}>
              Book the service, communicate directly with the provider, and pay securely through our platform.
            </Text>
          </View>
        </View>
      </View>
      {/* Jobs Section */}

    </>
  );

  // Remove FlatList, just render header (now includes services)
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {renderHeader()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroSection: { padding: 32, backgroundColor: '#4f8cff', alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  heroSubtitle: { marginTop: 16, fontSize: 18, color: '#e0e7ff', textAlign: 'center' },
  searchContainer: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  roleSection: { padding: 24, backgroundColor: '#f1f5f9', alignItems: 'center' },
  roleTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  roleSubtitle: { marginTop: 12, fontSize: 16, color: '#6b7280', textAlign: 'center' },
  roleButton: {
    marginTop: 20,
    backgroundColor: '#93c5fd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  roleButtonText: { color: '#1e3a8a', fontWeight: 'bold' },
  section: { padding: 24 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  sectionSubtitle: { marginTop: 12, fontSize: 16, color: '#6b7280', textAlign: 'center' },
  outlineButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  outlineButtonText: { color: '#3b82f6', fontWeight: 'bold' },
  stepsContainer: { flexDirection: 'column',gap:2, justifyContent: 'space-between', marginTop: 24 },
  stepBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  stepCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  stepNumber: { fontSize: 18, fontWeight: 'bold', color: '#9980F2' },
  stepTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stepText: { color: '#6b7280', fontSize: 14, textAlign: 'center' },
  ctaSection: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
    marginTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 4,
  },
  ctaTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' },
  ctaSubtitle: { fontSize: 20, color: '#9980F2', textAlign: 'center', marginTop: 4 },
  ctaText: { marginTop: 12, fontSize: 16, color: '#fff', textAlign: 'center' },
  ctaButtons: { flexDirection: 'row', marginTop: 20 },
  ctaPrimaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#9980F2',
  },
  ctaPrimaryButtonText: { color: '#9980F2', fontWeight: 'bold' },
  ctaOutlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#fff',
  },
  ctaOutlineButtonText: { color: '#9980F2', fontWeight: 'bold' },
});

export default Index;


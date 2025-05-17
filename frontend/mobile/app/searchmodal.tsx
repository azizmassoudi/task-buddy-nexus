import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../src/redux/store';
import { Ionicons } from '@expo/vector-icons';
import ServiceGrid from './servicegrid';
import { useRouter } from 'expo-router';
import { Service } from '../src/redux/types';

const screenWidth = Dimensions.get('window').width;

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { services } = useSelector((state: RootState) => state.services);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchTerm) return [];
    return services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, services]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return [];
    return jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, jobs]);

  const handleServicePress = (service: Service) => {
    onClose();
    setTimeout(() => {
      router.push({ pathname: '/servicedetailpage', params: { id: service.id } });
    }, 300);
  };
  const handleJobPress = (job: any) => {
    onClose();
    // Optionally, navigate to the job detail page here if needed
    // e.g., router.push({ pathname: '/jobassignemtpage', params: { id: job.id } });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.absoluteOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalContent, { width: screenWidth }]}
          onPress={() => {}}
        >
          <TextInput
            style={styles.input}
            placeholder="Search for a service or job..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
          {searchTerm.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Services</Text>
              {filteredServices.length > 0 ? (
                <ServiceGrid services={filteredServices} onServicePress={handleServicePress} />
              ) : (
                <Text style={styles.emptyText}>No services found.</Text>
              )}
              <Text style={styles.sectionTitle}>Jobs</Text>
              {filteredJobs.length > 0 ? (
                <FlatList
                  data={filteredJobs}
                  keyExtractor={item => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleJobPress(item)}>
                      <View style={styles.jobCard}>
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <Text style={styles.jobDesc}>{item.description}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.emptyText}>No jobs found.</Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteOverlay: {
    position: 'absolute',
    top: 70, // Adjust this value to match your navbar height
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#9980F2' },
  input: {
    borderWidth: 1,
    borderColor: '#9980F2',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    color: '#9980F2',
    backgroundColor: '#f8f7ff',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#9980F2', marginTop: 12, marginBottom: 4 },
  emptyText: { color: '#6b7280', fontSize: 15, textAlign: 'center', marginVertical: 8 },
  jobCard: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, marginBottom: 8 },
  jobTitle: { fontWeight: 'bold', color: '#111827', fontSize: 15 },
  jobDesc: { color: '#374151', fontSize: 13, marginTop: 2 },
});

export default SearchModal;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import { fetchJobs, createJob, deleteJob } from '../src/redux/slices/jobsSlice';

const Jobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { services } = useSelector((state: RootState) => state.services);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: '',
    service_id: '',
    clientId: '',
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleCreateJob = async () => {
    setIsSubmitting(true);
    try {
      if (!newJob.title || !newJob.description || !newJob.budget || !newJob.service_id || !user?.id) {
        throw new Error('Please fill in all required fields');
      }
      const jobData = {
        ...newJob,
        budget: Number(newJob.budget),
        clientId: user.id,
        service_id: Number(newJob.service_id),
        status: 'open',
      };
      await dispatch(createJob(jobData)).unwrap();
      Alert.alert('Job created', 'Your job has been created successfully.');
      setNewJob({
        title: '',
        description: '',
        budget: '',
        service_id: '',
        clientId: '',
      });
      dispatch(fetchJobs());
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteJob(Number(id))).unwrap();
              Alert.alert('Job deleted', 'The job has been deleted successfully.');
              dispatch(fetchJobs());
            } catch (err) {
              Alert.alert('Error', 'Failed to delete job. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Jobs</Text>
      <Text style={styles.cardDesc}>Manage your jobs here.</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={newJob.title}
          onChangeText={val => setNewJob({ ...newJob, title: val })}
          placeholder="Enter job title"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { minHeight: 60 }]}
          value={newJob.description}
          onChangeText={val => setNewJob({ ...newJob, description: val })}
          placeholder="Enter job description"
          multiline
        />
        <Text style={styles.label}>Budget</Text>
        <TextInput
          style={styles.input}
          value={newJob.budget.toString()}
          onChangeText={val => setNewJob({ ...newJob, budget: val })}
          placeholder="Enter job budget"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Service</Text>
        <View style={styles.pickerWrapper}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.pickerItem,
                newJob.service_id === service.id.toString() && styles.pickerItemSelected
              ]}
              onPress={() => setNewJob({ ...newJob, service_id: service.id.toString() })}
            >
              <Text style={newJob.service_id === service.id.toString() ? styles.pickerItemTextSelected : styles.pickerItemText}>
                {service.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateJob}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Creating...' : 'Create Job'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteJob(item.id.toString())}>
          <Text style={styles.deleteBtn}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDesc}>{item.description}</Text>
      <View style={styles.jobInfoRow}>
        <Text style={styles.jobInfo}>Budget: ${item.budget}</Text>
        <Text style={styles.jobInfo}>Status: {item.status}</Text>
        <Text style={styles.jobInfo}>Service ID: {item.service_id}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    loading ? (
      <View style={styles.centered}><ActivityIndicator size="large" color="#9980F2" /></View>
    ) : error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : (
      <Text style={styles.emptyText}>No jobs found.</Text>
    )
  );

  return (
    <FlatList
      data={jobs}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  card: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 24, elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  cardDesc: { color: "#6b7280", marginBottom: 12 },
  form: { marginTop: 8 },
  label: { fontSize: 14, color: "#374151", marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#f3f4f6" },
  button: { backgroundColor: "#9980F2", borderRadius: 8, paddingVertical: 12, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  pickerWrapper: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  pickerItem: { backgroundColor: "#e5e7eb", borderRadius: 8, padding: 8, marginRight: 8, marginBottom: 8 },
  pickerItemSelected: { backgroundColor: "#9980F2" },
  pickerItemText: { color: "#374151" },
  pickerItemTextSelected: { color: "#fff", fontWeight: "bold" },
  centered: { alignItems: "center", padding: 24 },
  errorText: { color: "#dc2626", fontWeight: "bold", fontSize: 16, marginTop: 8 },
  jobCard: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  deleteBtn: { color: "#dc2626", fontWeight: "bold" },
  jobDesc: { color: "#374151", marginTop: 4, marginBottom: 8 },
  jobInfoRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  jobInfo: { color: "#6b7280", fontSize: 13, marginRight: 12 },
  emptyText: { color: "#6b7280", fontSize: 16, marginTop: 16, textAlign: "center" },
});

export default Jobs;
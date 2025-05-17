import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { fetchJobs, deleteJob } from '../src/redux/slices/jobsSlice';
import { useRouter } from 'expo-router';

const ManageJob = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleCreateJob = () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to create a job.', [
        { text: 'OK', onPress: () => router.push('/login' as never) }
      ]);
      return;
    }
    router.push('/JobCreate' as never);
  };

  const handleViewJob = (jobId: string) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to view job details.', [
        { text: 'OK', onPress: () => router.push('/login' as never) }
      ]);
      return;
    }
    router.push({ pathname: '/JobReview', params: { id: jobId } } as never);
  };

  const handleEditJob = (jobId: string) => {
    if (!isAuthenticated || user?.role !== 'client') {
      Alert.alert('Access Denied', 'Only clients can edit jobs.');
      return;
    }
    router.push({ pathname: '/JobEdit', params: { id: jobId } } as never);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!isAuthenticated || user?.role !== 'client') {
      Alert.alert('Access Denied', 'Only clients can delete jobs.');
      return;
    }
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
              await dispatch(deleteJob(jobId)).unwrap();
              Alert.alert('Job Deleted', 'The job has been successfully deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job.');
            }
          }
        }
      ]
    );
  };

  const renderJob = ({ item: job }:any) => {
    const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{job.title}</Text>
          <Text style={styles.statusBadge}>{job.status}</Text>
        </View>
        <Text style={styles.cardDate}>{formattedDate}</Text>
        <Text style={styles.cardDescription}>{job.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.budget}>${job.budget}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewJob(job.id)}>
              <Text style={styles.actionBtnText}>View</Text>
            </TouchableOpacity>
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditJob(job.id)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteJob(job.id)}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Manage Jobs</Text>
        {isAuthenticated && user?.role === 'client' && (
          <TouchableOpacity style={styles.addButton} onPress={handleCreateJob}>
            <Text style={styles.addButtonText}>+ Add New Job</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#9980F2" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id?.toString()}
          renderItem={renderJob}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No jobs found</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateJob}>
            <Text style={styles.addButtonText}>Add Your First Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  addButton: { backgroundColor: "#9980F2", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  grid: { gap: 16 },
  card: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  statusBadge: { backgroundColor: "#dbeafe", color: "#9980F2", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, fontWeight: "bold" },
  cardDate: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  cardDescription: { color: "#374151", fontSize: 14, marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  budget: { color: "#9980F2", fontWeight: "bold", fontSize: 16 },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: { backgroundColor: "#e0e7ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 },
  actionBtnText: { color: "#9980F2", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "#fee2e2", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  deleteBtnText: { color: "#dc2626", fontWeight: "bold" },
  centered: { alignItems: "center", padding: 32 },
  loadingText: { color: "#6b7280", marginTop: 8 },
  errorText: { color: "#dc2626", fontWeight: "bold", fontSize: 16 },
  emptyText: { color: "#6b7280", fontSize: 16, marginBottom: 16 },
});

export default ManageJob;
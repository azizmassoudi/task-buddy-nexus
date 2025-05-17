import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { fetchJobs } from '../src/redux/slices/jobsSlice';


const ContractorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { jobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch, user]);

  if (!user || user.role !== 'subcontractor') {
    navigation.navigate('Login' as never);
    return null;
  }

  // Calculate stats
  const stats = {
    activeJobs: jobs.filter((job) => job.status === 'Rejected').length || 0,
    completedJobs: jobs.filter((job) => job.status === 'Approved').length || 0,
    pendingJobs: jobs.filter((job) => job.status === 'Pending').length || 0,
    totalEarnings: jobs.reduce((sum, job) => sum + (job.budget || 0), 0),
    averageRating: 4.8,
  };

  // Filtered jobs for tabs
  // Make sure to import StatusEnum from the correct location


  const activeJobs = jobs.filter((job) => job.status === 'Approved');
  const completedJobs = jobs.filter((job) => job.status === 'Pending');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Contractor Dashboard</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ServiceCreate' as never)}>
          <Text style={styles.addButtonText}>+ Add New Service</Text>
        </TouchableOpacity>
      </View>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Jobs</Text>
          <Text style={styles.statValue}>{stats.activeJobs}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed Jobs</Text>
          <Text style={styles.statValue}>{stats.completedJobs}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Jobs</Text>
          <Text style={styles.statValue}>{stats.pendingJobs}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Earnings</Text>
          <Text style={styles.statValue}>${stats.totalEarnings}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Rating</Text>
          <Text style={styles.statValue}>{stats.averageRating}</Text>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Active Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Completed Jobs</Text>
        </TouchableOpacity>
      </View>
      {/* Active Jobs List */}
      <Text style={styles.sectionTitle}>Active Jobs</Text>
      {activeJobs.length > 0 ? (
        <FlatList
          data={activeJobs}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobDesc}>{item.description}</Text>
              <Text style={styles.jobInfo}>Budget: ${item.budget}</Text>
              <Text style={styles.jobInfo}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No active jobs at the moment</Text>
      )}
      {/* Completed Jobs List */}
      <Text style={styles.sectionTitle}>Completed Jobs</Text>
      {completedJobs.length > 0 ? (
        <FlatList
          data={completedJobs}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobDesc}>{item.description}</Text>
              <Text style={styles.jobInfo}>Budget: ${item.budget}</Text>
              <Text style={styles.jobInfo}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No completed jobs yet</Text>
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
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statCard: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16, width: "30%", marginBottom: 12, alignItems: "center" },
  statLabel: { color: "#6b7280", fontSize: 13, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#9980F2" },
  tabsRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  tabButton: { backgroundColor: "#e0e7ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24, marginHorizontal: 8 },
  tabButtonText: { color: "#9980F2", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginTop: 24, marginBottom: 8 },
  jobCard: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  jobDesc: { color: "#374151", marginTop: 4, marginBottom: 8 },
  jobInfo: { color: "#6b7280", fontSize: 13, marginBottom: 2 },
  emptyText: { color: "#6b7280", fontSize: 16, marginTop: 8, textAlign: "center" },
});

export default ContractorDashboard;
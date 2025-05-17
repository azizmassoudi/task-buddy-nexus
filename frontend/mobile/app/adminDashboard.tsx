import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { fetchAllUsers } from '../src/redux/slices/userSlice';
import { fetchServices } from '../src/redux/slices/servicesSlice';
import { fetchJobs } from '../src/redux/slices/jobsSlice';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { services } = useSelector((state: RootState) => state.services);
  const { users } = useSelector((state: RootState) => state.user);
  const { jobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchServices());
    dispatch(fetchJobs());
  }, [dispatch]);

  // Stats calculations
  const stats = {
    activeServices: services.filter(service => service.status === 'Open').length || 0,
    pendingApprovals: jobs.filter(job => job.status === 'Pending').length || 0,
    totalUsers: users.length || 0,
    newUsers: users.filter(user => {
      const today = new Date();
      const userCreatedDate = new Date(user.created_at);
      return (
        userCreatedDate.getFullYear() === today.getFullYear() &&
        userCreatedDate.getMonth() === today.getMonth() &&
        userCreatedDate.getDate() === today.getDate()
      );
    }).length || 0,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user?.full_name || user?.username || user?.email}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.navigate('/manageservices')}
          >
            <Text style={styles.addButtonText}>+ Add New Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Services</Text>
          <Text style={styles.statValue}>{services.length}</Text>
          <Text style={styles.statNote}>
            {services.length > 0 ? "+1 from last month" : "No changes from last month"}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Services</Text>
          <Text style={styles.statValue}>{stats.activeServices}</Text>
          <Text style={styles.statNote}>
            {stats.activeServices > 0 && services.length > 0
              ? `${Math.round((stats.activeServices / services.length) * 100)}% of total`
              : "No active services"}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Approvals</Text>
          <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
          <Text style={styles.statNote}>
            {stats.pendingApprovals > 0 ? "Requires attention" : "All jobs approved"}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Users</Text>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statNote}>
            {stats.newUsers > 0 ? `+${stats.newUsers} new today` : "No new users today"}
          </Text>
        </View>
      </View>
      {/* Services List */}
      <Text style={styles.sectionTitle}>Services</Text>
      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDesc}>{item.description}</Text>
              <Text style={styles.serviceStatus}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No services found.</Text>
      )}
      {/* Users List */}
      <Text style={styles.sectionTitle}>Users</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.full_name || item.username}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userRole}>Role: {item.role}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No users found.</Text>
      )}
      {/* Jobs List */}
      <Text style={styles.sectionTitle}>Jobs</Text>
      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobDesc}>{item.description}</Text>
              <Text style={styles.jobStatus}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No jobs found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { color: "#6b7280", marginTop: 4 },
  addButton: { backgroundColor: "#9980F2", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, marginRight: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  outlineButton: { borderWidth: 1, borderColor: "#9980F2", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  outlineButtonText: { color: "#9980F2", fontWeight: "bold" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statCard: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16, width: "47%", marginBottom: 12, alignItems: "center" },
  statLabel: { color: "#6b7280", fontSize: 13, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#9980F2" },
  statNote: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginTop: 24, marginBottom: 8 },
  serviceCard: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  serviceTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  serviceDesc: { color: "#374151", marginTop: 4, marginBottom: 4 },
  serviceStatus: { color: "#6b7280", fontSize: 13 },
  userCard: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  userEmail: { color: "#374151", marginTop: 4, marginBottom: 4 },
  userRole: { color: "#6b7280", fontSize: 13 },
  jobCard: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  jobDesc: { color: "#374151", marginTop: 4, marginBottom: 4 },
  jobStatus: { color: "#6b7280", fontSize: 13 },
  emptyText: { color: "#6b7280", fontSize: 16, marginTop: 8, textAlign: "center" },
});

export default AdminDashboard;
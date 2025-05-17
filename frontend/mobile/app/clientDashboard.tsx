import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../src/redux/store';
import { useNavigation } from '@react-navigation/native';

const ClientDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    // You can log user or fetch more data here if needed
  }, []);

  if (!user || user.role !== 'client') {
    navigation.navigate('Login' as never);
    return null;
  }

  // Placeholder stats
  const stats = {
    activeRequests: 3,
    completedRequests: 8,
    pendingRequests: 2,
    messages: 5,
    savedServices: 12,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Client Dashboard</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {/* navigation.navigate('NewRequest') */}}
        >
          <Text style={styles.addButtonText}>+ New Request</Text>
        </TouchableOpacity>
      </View>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Requests</Text>
          <Text style={styles.statValue}>{stats.activeRequests}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed Requests</Text>
          <Text style={styles.statValue}>{stats.completedRequests}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Requests</Text>
          <Text style={styles.statValue}>{stats.pendingRequests}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Unread Messages</Text>
          <Text style={styles.statValue}>{stats.messages}</Text>
        </View>
      </View>
      {/* Tabs (simple version for mobile) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Active Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Completed Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Saved Services</Text>
        </TouchableOpacity>
      </View>
      {/* Tab Content Placeholder */}
      <View style={styles.tabContent}>
        <Text style={styles.tabContentText}>Tab content goes here.</Text>
      </View>
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
  statCard: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16, width: "47%", marginBottom: 12, alignItems: "center" },
  statLabel: { color: "#6b7280", fontSize: 13, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#9980F2" },
  tabsRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  tabButton: { backgroundColor: "#e0e7ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 4 },
  tabButtonText: { color: "#9980F2", fontWeight: "bold" },
  tabContent: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 24, alignItems: "center" },
  tabContentText: { color: "#6b7280", fontSize: 16 },
});

export default ClientDashboard;
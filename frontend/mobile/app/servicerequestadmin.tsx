import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import { updateRequestStatus, fetchAllServiceRequests } from '../src/redux/slices/service_requestSlice';
import { servicesAPI, userAPI } from '../src/lib/api';

const ServiceRequestsAdminPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading, error } = useSelector((state: RootState) => state.serviceRequests);
  const [serviceTitles, setServiceTitles] = useState<{ [key: number]: string }>({});
  const [subcontractorNames, setSubcontractorNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    dispatch(fetchAllServiceRequests());
  }, [dispatch]);

  useEffect(() => {
    // Fetch missing service titles and subcontractor names
    const fetchDetails = async () => {
      const serviceIds = Array.from(new Set(requests.map(r => r.service_id)));
      const subcontractorIds = Array.from(new Set(requests.map(r => r.subcontractor_id)));
      const newServiceTitles: { [key: number]: string } = { ...serviceTitles };
      const newSubcontractorNames: { [key: number]: string } = { ...subcontractorNames };
      for (const id of serviceIds) {
        if (!newServiceTitles[id]) {
          try {
            const res = await servicesAPI.getById(id);
            newServiceTitles[id] = res.data.title;
          } catch {}
        }
      }
      for (const id of subcontractorIds) {
        if (!newSubcontractorNames[id]) {
          try {
            const res = await userAPI.getUserById(id.toString());
            newSubcontractorNames[id] = res.data.full_name || res.data.username;
          } catch {}
        }
      }
      setServiceTitles(newServiceTitles);
      setSubcontractorNames(newSubcontractorNames);
    };
    if (requests.length > 0) fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  const handleAction = (requestId: number, status: 'Approved' | 'Rejected') => {
    Alert.alert(
      `${status} Request`,
      `Are you sure you want to ${status.toLowerCase()} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: status === 'Approved' ? 'default' : 'destructive',
          onPress: () => {
            dispatch(updateRequestStatus({ requestId, status }));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>Service: {serviceTitles[item.service_id] || '...'}</Text>
      <Text>Subcontractor: {subcontractorNames[item.subcontractor_id] || '...'}</Text>
      <Text>Message: {item.message || 'No message'}</Text>
      <Text>Proposed Price: ${item.proposed_price}</Text>
      <Text>Status: <Text style={{fontWeight:'bold'}}>{item.status}</Text></Text>
      <View style={styles.actionsRow}>
        {item.status === 'Pending' && (
          <>
            <TouchableOpacity style={[styles.actionBtn, styles.approve]} onPress={() => handleAction(item.id, 'Approved')}>
              <Text style={styles.actionText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.reject]} onPress={() => handleAction(item.id, 'Rejected')}>
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#9980F2" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>No service requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#9980F2', marginBottom: 16, textAlign: 'center' },
  list: { paddingBottom: 16 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginBottom: 14, elevation: 1 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 10 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 6, alignItems: 'center', marginHorizontal: 4 },
  approve: { backgroundColor: '#bbf7d0' },
  reject: { backgroundColor: '#fee2e2' },
  actionText: { fontWeight: 'bold', color: '#111827' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 20 },
});

export default ServiceRequestsAdminPage;

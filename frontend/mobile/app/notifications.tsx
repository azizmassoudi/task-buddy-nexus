import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../src/redux/slices/notificationSlice';

const NotificationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.notification, item.is_read ? styles.read : styles.unread]}
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      {!item.is_read && <Text style={styles.badge}>New</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAll}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#9980F2" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#9980F2' },
  markAll: { color: '#9980F2', fontWeight: 'bold' },
  list: { paddingBottom: 16 },
  notification: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginBottom: 10, position: 'relative' },
  unread: { borderLeftWidth: 4, borderLeftColor: '#9980F2' },
  read: { opacity: 0.6 },
  message: { fontSize: 16, color: '#111827', marginBottom: 4 },
  date: { fontSize: 12, color: '#6b7280' },
  badge: { position: 'absolute', top: 10, right: 14, backgroundColor: '#9980F2', color: '#fff', borderRadius: 8, paddingHorizontal: 8, fontSize: 12, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 20 },
});

export default NotificationScreen;

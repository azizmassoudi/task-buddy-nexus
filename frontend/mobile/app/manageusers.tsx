import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser, updateUserRole } from '../src/redux/slices/userSlice';
import { RootState, AppDispatch } from '../src/redux/store';
import { useRouter } from 'expo-router';

const ManageUsers = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?.is_superuser) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, user]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter((user: any) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.role?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleDelete = async (userId: string) => {
    setUserToDelete(null);
    try {
      await dispatch(deleteUser(userId)).unwrap();
      Alert.alert('Success', 'User deleted successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete user.');
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsEditModalOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (selectedUser && newRole) {
      try {
        await dispatch(updateUserRole({
          userId: selectedUser.id,
          role: newRole
        })).unwrap();
        Alert.alert('Success', 'User role updated successfully.');
        setIsEditModalOpen(false);
        dispatch(fetchAllUsers());
      } catch (err) {
        Alert.alert('Error', 'Failed to update user role.');
      }
    }
  };

  if (!user?.is_superuser) {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.denyIcon}>⛔</Text>
          <Text style={styles.denyTitle}>Access Denied</Text>
          <Text style={styles.denyDesc}>Only administrators can access this page.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.navigate('/' as never)}>
            <Text style={styles.primaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerDesc}>View, edit, and manage user accounts and permissions.</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, or role"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#888"
        />
        <View style={styles.tableHeader}>
          <Text style={styles.th}>Name</Text>
          <Text style={styles.th}>Email</Text>
          <Text style={styles.th}>Role</Text>
          <Text style={styles.th}>Status</Text>
          <Text style={styles.th}>Joined</Text>
          <Text style={styles.th}>Actions</Text>
        </View>
      </View>
    </>
  );

  const renderItem = ({ item: u }: any) => (
    <View key={u.id} style={styles.tableRow}>
      <Text style={styles.td}>{u.full_name || u.name}</Text>
      <Text style={styles.td}>{u.email}</Text>
      <Text style={[styles.td, roleBadge(u.role)]}>{u.role}</Text>
      <Text style={[styles.td, u.is_active ? styles.activeBadge : styles.inactiveBadge]}>
        {u.is_active ? 'Active' : 'Inactive'}
      </Text>
      <Text style={styles.td}>{new Date(u.created_at).toLocaleDateString()}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(u)}>
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]}
          onPress={() =>
            Alert.alert(
              'Delete User',
              'Are you sure you want to delete this user?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(u.id) }
              ]
            )
          }
        >
          <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    loading ? (
      <View style={styles.loadingRow}>
        <ActivityIndicator size="large" color="#9980F2" />
        <Text style={{ color: '#6b7280', marginTop: 8 }}>Loading users...</Text>
      </View>
    ) : (
      <View style={styles.loadingRow}>
        <Text style={{ color: '#6b7280', fontWeight: 'bold' }}>No users found</Text>
        <Text style={{ color: '#9ca3af' }}>Try adjusting your search criteria</Text>
      </View>
    )
  );

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.bg}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={isEditModalOpen ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User Role</Text>
            <Text style={styles.modalDesc}>
              Change the role for {selectedUser?.full_name || selectedUser?.name}
            </Text>
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#f3f4f6' }]}
              value={selectedUser?.email || ''}
              editable={false}
            />
            <Text style={styles.modalLabel}>Role</Text>
            <View style={styles.rolePickerRow}>
              {['client', 'admin', 'subcontractor'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.rolePickerBtn,
                    newRole === role && styles.rolePickerBtnActive
                  ]}
                  onPress={() => setNewRole(role)}
                >
                  <Text style={newRole === role ? styles.rolePickerTextActive : styles.rolePickerText}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setIsEditModalOpen(false)}>
                <Text style={styles.outlineButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRoleUpdate}>
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    />
  );
};

const roleBadge = (role: string) => ({
  backgroundColor:
    role === 'admin' ? '#ede9fe' :
    role === 'client' ? '#dbeafe' :
    '#f3f4f6',
  color:
    role === 'admin' ? '#7c3aed' :
    role === 'client' ? '#9980F2' :
    '#374151',
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 2,
  textAlign: 'center' as 'center',
  fontWeight: 'bold' as 'bold'
});

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f3f4f6' } as ViewStyle,
  header: { backgroundColor: '#9980F2', paddingVertical: 32, paddingHorizontal: 16, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerDesc: { color: '#dbeafe', marginTop: 8, fontSize: 16, textAlign: 'center' },
  content: { padding: 16 },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', padding: 10, marginBottom: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 8, borderRadius: 8 },
  th: { flex: 1, fontWeight: 'bold', color: '#374151', fontSize: 13, textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  td: { flex: 1, color: '#374151', fontSize: 13, textAlign: 'center' },
  actionCell: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  actionBtn: { backgroundColor: '#e0e7ff', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12, marginHorizontal: 2 },
  actionBtnText: { color: '#9980F2', fontWeight: 'bold' },
  loadingRow: { alignItems: 'center', padding: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', width: '90%', elevation: 3 },
  denyIcon: { fontSize: 32, marginBottom: 8 },
  denyTitle: { fontSize: 20, fontWeight: 'bold', color: '#dc2626', marginBottom: 4 },
  denyDesc: { color: '#6b7280', marginBottom: 16, textAlign: 'center' },
  primaryButton: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  outlineButton: { borderWidth: 1, borderColor: '#9980F2', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8, marginRight: 8, flex: 1 },
  outlineButtonText: { color: '#9980F2', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '90%', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalDesc: { color: '#6b7280', marginBottom: 16 },
  modalLabel: { fontWeight: 'bold', color: '#374151', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 8 },
  rolePickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  rolePickerBtn: { flex: 1, marginHorizontal: 4, backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  rolePickerBtnActive: { backgroundColor: '#9980F2' },
  rolePickerText: { color: '#374151', fontWeight: 'bold' },
  rolePickerTextActive: { color: '#fff', fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  activeBadge: { backgroundColor: '#bbf7d0', color: '#166534', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, textAlign: 'center', fontWeight: 'bold' },
  inactiveBadge: { backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, textAlign: 'center', fontWeight: 'bold' },
});

export default ManageUsers;
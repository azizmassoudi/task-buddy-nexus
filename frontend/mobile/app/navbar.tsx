import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import { logout } from '../src/redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from './searchmodal';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.navigate('/login' as never);
  };

  const handleProfile = () => {
    setMenuVisible(false);
    router.navigate('/Profile' as never);
  };

  const handleLogoutAndClose = () => {
    setMenuVisible(false);
    handleLogout();
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.navigate('/' as never)}> 
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <View style={styles.menuRow}>
        {/* Search Icon triggers modal */}
        <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
          <Ionicons name="search" size={24} color="#9980F2" />
        </TouchableOpacity>
        {/* Notification Icon */}
        <TouchableOpacity style={{ marginRight: 10, marginLeft: 8 }} onPress={() => router.navigate('/notifications' as never)}>
          <Ionicons name="notifications-outline" size={26} color="#9980F2" />
        </TouchableOpacity>
        {isAuthenticated && user ? (
          <>
            {/* Hamburger menu icon */}
            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => {
                if (user.role === 'admin') {
                  router.navigate('/adminSidebar' as never);
                } else if (user.role === 'client') {
                  router.navigate('/clientSidebar' as never);
                } else if (user.role === 'subcontractor') {
                  router.navigate('/subcontractorsidebar' as never);
                }
              }}
            >
              <View style={styles.bar} />
              <View style={styles.bar} />
              <View style={styles.bar} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.navigate('/login' as never)}
          >
            <Text style={styles.menuButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <SearchModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
  },
  logoBox: { flexDirection: 'row', alignItems: 'center' },
  logoText: {
    backgroundColor: '#9980F2',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    borderRadius: 8,
    width: 36,
    height: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 36,
  },
  logoTitle: { marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: '#9980F2' },
  searchContainer: {
    marginHorizontal: 8,
    minWidth: 32,
    maxWidth: 200,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#9980F2',
    borderRadius: 8,
    padding: 8,
    color: '#9980F2',
    fontSize: 16,
    backgroundColor: '#f8f7ff',
    minWidth: 120,
    flex: 1,
    maxWidth: 200,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  menuButton: { marginLeft: 18 },
  menuButtonText: { color: '#9980F2', fontWeight: 'bold', fontSize: 16 },
  menuIcon: {
    marginLeft: 18,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    height: 3,
    backgroundColor: '#9980F2',
    marginVertical: 2,
    borderRadius: 2,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 140,
    zIndex: 100,
  },
  profileName: {
    fontWeight: 'bold',
    color: '#9980F2',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  dropdownButtonText: {
    color: '#9980F2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Navbar;
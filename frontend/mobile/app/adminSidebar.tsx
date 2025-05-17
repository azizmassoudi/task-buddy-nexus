import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

const AdminSidebar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <NavItem to="profile" label="Profile" />
        <NavItem to="adminDashboard" label="Dashboard" />
        <NavItem to="manageusers" label="Manage Users" />
        <NavItem to="manageservices" label="Manage Services" />
        <NavItem to="managejob" label="Manage Jobs" />
        <NavItem to="servicerequestadmin" label="Service Requests" />
        <NavItem to="login" label="Logout" />
      </View>
    </View>
  );
};

interface NavItemProps {
  to: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  const navigation = useNavigation();
  const iconMap: Record<string, string> = {
    profile: 'user',
    adminDashboard: 'grid',
    manageusers: 'users',
    manageservices: 'settings',
    managejob: 'briefcase',
    serviceRequest: 'file-text',
    login: 'log-out', // Feather logout icon
  };
  const iconName = iconMap[to] || 'arrow-right';
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => navigation.navigate(to as never)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name={iconName as any} size={22} color="#9980F2" style={{ marginRight: 12 }} />
        <Text style={styles.navItemText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 32,
    paddingHorizontal: 20,
    minHeight: "100%",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  headerText: {
    color: "#9980F2",
    fontWeight: "bold",
    fontSize: 28,
  },
  nav: {
    marginTop: 8,
  },
  navItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 2,
    marginBottom: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 1,
  },
  navItemText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#9980F2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    color: '#9980F2',
    fontSize: 16,
    backgroundColor: '#f8f7ff',
  },
});

export default AdminSidebar;

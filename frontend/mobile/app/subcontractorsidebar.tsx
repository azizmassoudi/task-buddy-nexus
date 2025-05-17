import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

const SubcontractorSidebar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <NavItem to="profile" label="Profile" icon="user" />
        <NavItem to="contractorDashboard" label="Dashboard" icon="grid" />
        <NavItem to="servicesPpage" label="Browse Services" icon="search" />
        <NavItem to="myjobs" label="My Jobs" icon="briefcase" />
        <NavItem to="notifications" label="Notifications" icon="bell" />
        <NavItem to="login" label="Logout" icon="log-out" />
      </View>
    </View>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => navigation.navigate(to as never)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name={icon as any} size={22} color="#9980F2" style={{ marginRight: 12 }} />
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
});

export default SubcontractorSidebar;

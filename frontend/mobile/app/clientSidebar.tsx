import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ClientSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={[styles.sidebar, collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded]}>
      <View style={styles.header}>
        {!collapsed && <Text style={styles.headerText}>Client</Text>}
        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nav}>
        <NavItem to="ClientDashboard" label="Dashboard" collapsed={collapsed} />
        <NavItem to="ServicesPage" label="Browse Services" collapsed={collapsed} />
        <NavItem to="Jobs" label="My Jobs" collapsed={collapsed} />
        <NavItem to="Profile" label="Profile" collapsed={collapsed} />
      </View>
    </View>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, collapsed }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.navItem, collapsed ? styles.navItemCollapsed : styles.navItemExpanded]}
      onPress={() => navigation.navigate(to as never)}
    >
      {!collapsed && <Text style={styles.navItemText}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "#9980F2",
    minHeight: "100%",
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: "flex-start",
  },
  sidebarCollapsed: { width: 56 },
  sidebarExpanded: { width: 180 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 24 },
  headerText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  menuIcon: { color: "#fff", fontSize: 22, padding: 4 },
  nav: { marginTop: 8 },
  navItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  navItemCollapsed: { alignItems: "center", justifyContent: "center" },
  navItemExpanded: {},
  navItemText: { color: "#fff", fontSize: 16 },
});

export default ClientSidebar;

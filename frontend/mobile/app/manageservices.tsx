import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "../src/redux/store";

const ManageServices = () => {
  const router = useRouter();
  const { services } = useSelector((state: RootState) => state.services);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Open":
        return [styles.badge, styles.badgeOpen];
      case "In Progress":
        return [styles.badge, styles.badgeInProgress];
      case "Completed":
        return [styles.badge, styles.badgeCompleted];
      case "Cancelled":
        return [styles.badge, styles.badgeCancelled];
      default:
        return styles.badge;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Manage Services</Text>
          <Text style={styles.subtitle}>View and manage your service offerings</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.navigate('/manageservices/add' as never)}>
          <Text style={styles.addButtonText}>+ Add New Service</Text>
        </TouchableOpacity>
      </View>
      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.grid}
          renderItem={({ item: service }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={getStatusBadgeStyle(service.status)}>{service.status}</Text>
              </View>
              <Text style={styles.cardDate}>Created on {formatDate(service.created_at)}</Text>
              <Text style={styles.cardDescription}>{service.description}</Text>
              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.editButton} onPress={() => router.navigate(`/manageservices/edit/${service.id}`)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>+</Text>
          </View>
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptyDesc}>
            You haven't created any services yet. Get started by creating your first service.
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.navigate('/manageservices/add')}>
            <Text style={styles.addButtonText}>+ Add Your First Service</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { color: "#6b7280", marginTop: 4 },
  addButton: { backgroundColor: "#9980F2", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  grid: { gap: 16 },
  card: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, color: "#fff", fontWeight: "bold" },
  badgeOpen: { backgroundColor: "#9980F2" },
  badgeInProgress: { backgroundColor: "#f59e42" },
  badgeCompleted: { backgroundColor: "#22c55e" },
  badgeCancelled: { backgroundColor: "#ef4444" },
  cardDate: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  cardDescription: { color: "#374151", fontSize: 14, marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  editButton: { backgroundColor: "#e0e7ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 },
  editButtonText: { color: "#9980F2", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#fee2e2", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  deleteButtonText: { color: "#dc2626", fontWeight: "bold" },
  emptyContainer: { alignItems: "center", padding: 32, backgroundColor: "#f3f4f6", borderRadius: 12, marginTop: 32 },
  emptyIcon: { backgroundColor: "#dbeafe", borderRadius: 32, padding: 16, marginBottom: 16 },
  emptyIconText: { color: "#9980F2", fontSize: 32, fontWeight: "bold" },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#111827" },
  emptyDesc: { color: "#6b7280", marginBottom: 16, textAlign: "center" },
});

export default ManageServices;
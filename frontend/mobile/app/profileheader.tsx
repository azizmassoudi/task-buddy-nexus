import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getImageUrl } from './utils';

interface ProfileHeaderProps {
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
}

const ProfileHeader = ({ name, role, location, avatarUrl }: ProfileHeaderProps) => {
  const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.82:8000';
  // Optionally handle avatar fallback
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";
  const fallbackImage = require('../assets/images/icon.png'); 

  const imageSource =
    avatarUrl
      ? { uri: getImageUrl(avatarUrl, backendUrl) }
      : fallbackImage;
  return (
    <View style={styles.card}>
      <View style={styles.bgTop} />
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={imageSource} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{initials}</Text>
          </View>
        )}
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, elevation: 2 },
  bgTop: { height: 80, backgroundColor: "#a78bfa", width: "100%" },
  avatarContainer: {
    position: "absolute",
    top: 40,
    left: "50%",
    marginLeft: -48,
    zIndex: 2,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: { color: "#7c3aed", fontSize: 32, fontWeight: "bold" },
  infoSection: { alignItems: "center", marginTop: 64, paddingBottom: 16 },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827", marginTop: 8 },
  role: { color: "#a78bfa", fontWeight: "bold", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationIcon: { fontSize: 16, marginRight: 4 },
  locationText: { color: "#6b7280", fontSize: 14 },
});

export default ProfileHeader;

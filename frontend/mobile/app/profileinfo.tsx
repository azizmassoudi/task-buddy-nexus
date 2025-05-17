import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

interface ProfileInfoProps {
  bio: any;
  email: string;
  website?: string;
}

const ProfileInfo = ({ bio, email, website }: ProfileInfoProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.bio}>{bio}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      {website && (
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => Linking.openURL(`https://${website}`)}
        >
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.link}>{website}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2, marginBottom: 16 },
  title: { fontWeight: "bold", fontSize: 18, color: "#7c3aed", marginBottom: 8 },
  bio: { color: "#6b7280", marginBottom: 12, fontSize: 15 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { color: "#7c3aed", fontWeight: "bold", marginRight: 6 },
  value: { color: "#374151" },
  link: { color: "#9980F2", textDecorationLine: "underline" },
});

export default ProfileInfo;
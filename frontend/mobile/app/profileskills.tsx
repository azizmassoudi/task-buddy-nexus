import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProfileSkillsProps {
  skills: any[];
}

const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Skills & Expertise</Text>
      <View style={styles.skillsRow}>
        {skills.map((skill, index) => (
          <Text key={index} style={styles.skillBadge}>
            {skill.name}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2, marginBottom: 16 },
  title: { fontWeight: "bold", fontSize: 18, color: "#7c3aed", marginBottom: 8 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillBadge: {
    backgroundColor: "#ede9fe",
    color: "#7c3aed",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 13,
    marginRight: 8,
    marginBottom: 4,
  },
});

export default ProfileSkills;
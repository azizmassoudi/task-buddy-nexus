import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Stat {
  label: string;
  value: string;
}

interface ProfileStatsProps {
  stats: Stat[];
  role: string | null;
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Statistics</Text>
      <View>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statGroup}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${Math.min((index + 1) * 30, 100)}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2 },
  title: { fontWeight: "bold", fontSize: 18, color: "#111827", marginBottom: 12 },
  statGroup: { marginBottom: 16 },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLabel: { color: "#6b7280", fontSize: 14 },
  statValue: { color: "#111827", fontWeight: "bold", fontSize: 18 },
  progressBarBg: { marginTop: 8, height: 6, backgroundColor: "#ede9fe", borderRadius: 3, overflow: "hidden" },
  progressBar: { height: 6, backgroundColor: "#a78bfa", borderRadius: 3 },
});

export default ProfileStats;
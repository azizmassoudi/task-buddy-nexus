import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const About = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>About Task Buddy Nexus</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            Task Buddy Nexus is dedicated to connecting skilled professionals with clients who need their expertise.
            We believe in creating meaningful connections that benefit both parties through our innovative platform.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Seamless project management and communication</Text>
            <Text style={styles.listItem}>• Secure payment processing</Text>
            <Text style={styles.listItem}>• Verified professional profiles</Text>
            <Text style={styles.listItem}>• Real-time messaging and updates</Text>
            <Text style={styles.listItem}>• Comprehensive service listings</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            We are a team of passionate individuals committed to revolutionizing how people connect and collaborate
            in the professional services industry. Our platform is built with user experience and security in mind.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 2, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#9980F2', marginBottom: 8 },
  sectionText: { fontSize: 16, color: '#374151', marginBottom: 4 },
  list: { marginLeft: 8, marginTop: 4 },
  listItem: { fontSize: 16, color: '#374151', marginBottom: 2 },
});

export default About;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.brandTitle}>ServiceConnect</Text>
      </View>
      <Text style={styles.slogan}>
        Connecting quality services with those who need them.
      </Text>
      <View style={styles.linksRow}>
        <Text style={styles.link}>About Us</Text>
        <Text style={styles.link}>Help Center</Text>
        <Text style={styles.link}>Terms</Text>
        <Text style={styles.link}>Contact</Text>
      </View>
      <Text style={styles.copyright}>
        © 2025 ServiceConnect, Inc. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logoBox: {
    backgroundColor: '#9980F2',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  brandTitle: { marginLeft: 8, fontSize: 18, fontWeight: 'bold', color: '#9980F2' },
  slogan: { color: '#6b7280', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  linksRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  link: { color: '#9980F2', marginHorizontal: 8, fontWeight: 'bold', fontSize: 14 },
  copyright: { color: '#9ca3af', fontSize: 13, textAlign: 'center' },
});

export default Footer;

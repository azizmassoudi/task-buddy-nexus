import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const NotFound = () => {
  const navigation = useNavigation();
  const route = useRoute();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      route?.name
    );
  }, [route?.name]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.description}>
          The page <Text style={styles.bold}>{route?.name}</Text> you are looking for doesn't exist or has been moved.
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Index' as never)}
          >
            <Text style={styles.primaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('About' as never )}
          >
            <Text style={styles.outlineButtonText}>Visit About Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Services' as never)}
          >
            <Text style={styles.outlineButtonText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', width: '90%', elevation: 4 },
  code: { fontSize: 64, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  title: { fontSize: 24, color: '#374151', marginBottom: 12, fontWeight: 'bold' },
  description: { color: '#6b7280', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  bold: { fontWeight: 'bold', color: '#111827' },
  buttonGroup: { width: '100%' },
  primaryButton: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 14, marginBottom: 12, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  outlineButton: { borderWidth: 1, borderColor: '#9980F2', borderRadius: 8, paddingVertical: 14, marginBottom: 12, alignItems: 'center' },
  outlineButtonText: { color: '#9980F2', fontWeight: 'bold', fontSize: 16 },
});

export default NotFound;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../src/redux/slices/authSlice';
import { RootState, AppDispatch } from '../src/redux/store';
import { useRouter } from 'expo-router';

interface AuthError {
  type?: string;
  loc?: string[];
  msg?: string;
  input?: string;
  url?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Login failed', 'Please fill in both email and password');
      return;
    }
    try {
      await dispatch(login({ email, password })).unwrap();
      Alert.alert('Login successful', 'Welcome back!');
      router.navigate('/' as never);
    } catch (err: any) {
      Alert.alert('Login failed', err?.msg || 'Invalid credentials');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.description}>Enter your credentials to sign in</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error && (
            <Text style={styles.errorText}>
              {(error as AuthError).msg || 'An error occurred'}
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => router.navigate('/register')}
            >
              Create an account
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 3 },
  logoBox: { alignItems: 'center', marginBottom: 16 },
  logoText: { backgroundColor: '#9980F2', color: '#fff', fontWeight: 'bold', fontSize: 24, borderRadius: 8, width: 48, height: 48, textAlign: 'center', textAlignVertical: 'center', lineHeight: 48 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  description: { textAlign: 'center', color: '#6b7280', marginBottom: 16 },
  form: { marginTop: 8 },
  label: { fontSize: 14, color: '#374151', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f3f4f6' },
  button: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 12, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 8 },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#374151' },
  footerLink: { color: '#9980F2', fontWeight: 'bold' },
});

export default Login;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../src/redux/slices/authSlice';
import { RootState, AppDispatch } from '../src/redux/store';
import { UserRole } from '../src/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface AuthError {
  type?: string;
  loc?: string[];
  msg?: string;
  input?: string;
  url?: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'client' as UserRole,
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await dispatch(register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role
      })).unwrap();
      Alert.alert('Registration successful', 'You can now login with your credentials');
      await dispatch(login({ email: formData.email, password: formData.password })).unwrap();
      navigation.navigate('AddSkills' as never);
    } catch (err: any) {
      Alert.alert('Registration failed', err.msg || 'An error occurred during registration');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.description}>Join us to get started</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="JohnDoe"
            value={formData.username}
            onChangeText={val => handleChange('username', val)}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={formData.full_name}
            onChangeText={val => handleChange('full_name', val)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            value={formData.email}
            onChangeText={val => handleChange('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={val => handleChange('password', val)}
            secureTextEntry
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={val => handleChange('confirmPassword', val)}
            secureTextEntry
          />
          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.role}
              onValueChange={val => handleChange('role', val ?? '')}
              style={styles.picker}
            >
              <Picker.Item label="Client" value="client" />
              <Picker.Item label="Contractor" value="subcontractor" />
            </Picker>
          </View>
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
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login' as never)}
            >
              Login
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
  pickerWrapper: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginTop: 4, marginBottom: 8, backgroundColor: '#f3f4f6' },
  picker: { height: 44, width: '100%' },
  button: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 12, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 8 },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#374151' },
  footerLink: { color: '#9980F2', fontWeight: 'bold' },
});

export default Register;
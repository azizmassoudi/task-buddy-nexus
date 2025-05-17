// AddSkills.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux/store';
import { addUserSkill, fetchAllSkills } from '../src/redux/slices/skillsSlice';

const AddSkills = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading, error } = useSelector((state: RootState) => state.skills);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllSkills());
  }, [dispatch]);

  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    try {
      await Promise.all(
        selectedSkills.map(skillId =>
          dispatch(addUserSkill({ userId: user.id.toString(), skillId }))
        )
      );
      Alert.alert('Skills added successfully', 'Your profile setup is complete');
    } catch (err) {
      Alert.alert('Error saving skills', 'Failed to save your skills selection');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.description}>
          Select your skills to help us match you with relevant projects
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Search skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <View style={styles.skillsGrid}>
          {filteredSkills.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.skillButton,
                selectedSkills.includes(skill.id) && styles.skillButtonSelected
              ]}
              onPress={() => handleSkillToggle(skill.id)}
            >
              <Text style={selectedSkills.includes(skill.id) ? styles.skillButtonTextSelected : styles.skillButtonText}>
                {skill.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <TouchableOpacity
          style={[styles.button, (loading || selectedSkills.length === 0) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || selectedSkills.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Finish Setup</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footerText}>
          You can always update your skills later in your profile settings
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 3, alignItems: 'center' },
  logoBox: { alignItems: 'center', marginBottom: 16 },
  logoText: { backgroundColor: '#9980F2', color: '#fff', fontWeight: 'bold', fontSize: 24, borderRadius: 8, width: 48, height: 48, textAlign: 'center', textAlignVertical: 'center', lineHeight: 48 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  description: { textAlign: 'center', color: '#6b7280', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f3f4f6', width: '100%', marginBottom: 16 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  skillButton: { backgroundColor: '#e5e7eb', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, margin: 4 },
  skillButtonSelected: { backgroundColor: '#9980F2' },
  skillButtonText: { color: '#374151' },
  skillButtonTextSelected: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 12, marginTop: 20, alignItems: 'center', width: '100%' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 8 },
  footerText: { marginTop: 24, fontSize: 14, color: '#374151', textAlign: 'center' },
});

export default AddSkills;
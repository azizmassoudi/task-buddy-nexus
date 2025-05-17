import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { fetchAllUsers, uploadCV } from '../src/redux/slices/userSlice';
import ProfileHeader from './profileheader';
import ProfileInfo from './profileinfo';
import ProfileSkills from './profileskills';
import ProfileStats from './profilestats';
import { fetchAboutByUserId } from '../src/redux/slices/aboutSlice';
import * as DocumentPicker from 'expo-document-picker';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);
  const { currentAbout } = useSelector((state: RootState) => state.about);
  const { userSkills } = useSelector((state: RootState) => state.skills);

  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [cvUploadSuccess, setCvUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    full_name: user?.full_name || '',
    avatar: user?.avatar || '',
    role: user?.role || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        avatar: user.avatar || '',
        role: user.role || '',
      });
    }
    dispatch(fetchAllUsers());
    dispatch(fetchAboutByUserId(user?.id || ''));
  }, [user, dispatch]);

  const handleCVUpload = async () => {
    try {
      setCvUploading(true);
      setCvUploadError(null);
      setCvUploadSuccess(false);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setCvUploading(false);
        return;
      }

      const fileAsset = result.assets[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Fallback to extension check if mimeType is missing
      const isValidType = fileAsset?.mimeType
        ? validTypes.includes(fileAsset.mimeType)
        : /\.(pdf|doc|docx)$/i.test(fileAsset?.name || '');

      if (!isValidType) {
        throw new Error('Please upload a PDF or Word document');
      }
      if (typeof fileAsset?.size === 'number' && fileAsset.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Prepare file object for upload (React Native style)
      const file = {
        uri: fileAsset.uri,
        name: fileAsset.name,
        type: fileAsset.mimeType || 'application/octet-stream',
      };

      await dispatch(uploadCV(file)).unwrap();
      setCvUploadSuccess(true);
      setTimeout(() => setCvUploadSuccess(false), 3000);
    } catch (err: any) {
      setCvUploadError(err.message || 'Failed to upload CV');
    } finally {
      setCvUploading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.grayText}>Please log in to view your profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bg}>
      <View style={styles.container}>
        <ProfileHeader
          name={formData.full_name}
          role={formData.role}
          location="San Francisco, CA"
          avatarUrl={formData.avatar || ''}
        />

        <View style={styles.section}>
          <ProfileInfo
            bio={currentAbout?.content || ''}
            email={formData.email}
            website="www.alexjohnson.design"
          />

          {/* CV Upload Section */}
          <View style={styles.cvSection}>
            <Text style={styles.cvTitle}>Upload Your CV</Text>
            <TouchableOpacity
              style={[styles.cvButton, cvUploading && styles.cvButtonDisabled]}
              onPress={handleCVUpload}
              disabled={cvUploading}
            >
              <Text style={styles.cvButtonText}>
                {cvUploading ? 'Uploading...' : 'Upload CV'}
              </Text>
              {cvUploading && <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
            {cvUploadError && (
              <Text style={styles.cvError}>{cvUploadError}</Text>
            )}
            {cvUploadSuccess && (
              <Text style={styles.cvSuccess}>CV uploaded successfully!</Text>
            )}
            <Text style={styles.cvNote}>
              Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB
            </Text>
          </View>

          <ProfileSkills skills={userSkills} />
        </View>

        <View style={styles.statsSection}>
          <ProfileStats
            stats={[
              { label: "Projects", value: "36" },
              { label: "Experience", value: "8 years" },
              { label: "Clients", value: `${users?.length || 0}` }
            ]}
            role={user?.role}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f5f3ff' },
  container: { padding: 16 },
  section: { marginTop: 16, marginBottom: 16 },
  statsSection: { marginTop: 16, marginBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  grayText: { color: '#6b7280', fontSize: 16 },
  cvSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16, marginBottom: 16, elevation: 2 },
  cvTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#111827' },
  cvButton: { backgroundColor: '#a78bfa', borderRadius: 8, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  cvButtonDisabled: { opacity: 0.5 },
  cvButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cvError: { color: '#dc2626', marginTop: 8, backgroundColor: '#fee2e2', padding: 8, borderRadius: 6 },
  cvSuccess: { color: '#16a34a', marginTop: 8, backgroundColor: '#bbf7d0', padding: 8, borderRadius: 6 },
  cvNote: { color: '#6b7280', fontSize: 13, marginTop: 8 },
});

export default Profile;
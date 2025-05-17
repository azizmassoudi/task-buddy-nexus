import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { fetchJobById, updateJobStatus, StatusEnum } from '../src/redux/slices/jobsSlice';
import { fetchServiceById } from '../src/redux/slices/servicesSlice';
import { fetchAllUsers } from '../src/redux/slices/userSlice';
import { createNotification } from '../src/redux/slices/notificationSlice';
import { fetchAllSkills, fetchUserSkills } from '../src/redux/slices/skillsSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const JobAssignmentPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCvViewerOpen, setIsCvViewerOpen] = useState(false);

  const { currentJob, loading: jobsLoading, error: jobsError } = useSelector((state: RootState) => state.jobs);
  const { currentService, loading: servicesLoading, error: servicesError } = useSelector((state: RootState) => state.services);
  const { users, loading: usersLoading, error: usersError } = useSelector((state: RootState) => state.user);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userSkills } = useSelector((state: RootState) => state.skills);
  const subcontractor = users.find((u) => Number(u.id) === currentJob?.freelancer_id);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(Number(id)));
      if (currentJob?.service_id) {
        dispatch(fetchServiceById(currentJob?.service_id));
      }
      dispatch(fetchAllUsers());
    }
  }, [dispatch, id, currentJob?.service_id]);

  useEffect(() => {
    dispatch(fetchUserSkills(25));
  }, [dispatch]);

  const handleApprove = async () => {
    if (!currentJob || !id) return;
    try {
      await dispatch(updateJobStatus({
        id: Number(id),
        status: StatusEnum.Assigned
      })).unwrap();
      if (currentJob.freelancer_id) {
        await dispatch(createNotification({
          user_id: Number(currentJob.freelancer_id),
          message: `You have been approved for the job: ${currentJob.title}`,
          type: 'success',
        })).unwrap();
      }
      Alert.alert('Subcontractor Approved', 'The subcontractor has been approved for this job and notified.');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve subcontractor or send notification.');
    }
  };

  const handleReject = async () => {
    if (!currentJob || !id) return;
    try {
      await dispatch(updateJobStatus({ id: Number(id), status: 'Rejected' })).unwrap();
      Alert.alert('Subcontractor Rejected', 'The subcontractor has been removed from this job.');
      navigation.navigate('Jobs' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject subcontractor.');
    }
  };

  const formattedDate = new Date(currentJob?.created_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.denyTitle}>Access Denied</Text>
          <Text style={styles.denyDesc}>You must be logged in as a client to review jobs.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.primaryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (jobsLoading || servicesLoading || usersLoading) {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.loadingTitle}>Loading job details...</Text>
        </View>
      </View>
    );
  }

  if (jobsError || servicesError || usersError) {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.denyTitle}>Error loading job</Text>
          <Text style={styles.denyDesc}>{jobsError || servicesError || usersError}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Jobs' as never)}>
            <Text style={styles.primaryButtonText}>Back to Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentJob) {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.notFoundTitle}>Job Not Found</Text>
          <Text style={styles.notFoundDesc}>The job you're looking for doesn't exist or has been removed.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Jobs' as never)}>
            <Text style={styles.primaryButtonText}>Browse All Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bg}>
      <View style={styles.container}>
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.backLink}>← Back to Jobs</Text>
          </TouchableOpacity>
          <Text style={styles.badge}>{currentJob.status}</Text>
          <Text style={styles.title}>{currentJob.title}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Posted on {formattedDate}</Text>
            <Text style={styles.infoText}>${currentJob.budget}</Text>
          </View>
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.sectionText}>{currentJob.description}</Text>
          </View>
          {currentService && (
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              <Text style={styles.serviceTitle}>{currentService.title}</Text>
              <Text style={styles.sectionText}>{currentService.description}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>{currentService.location}</Text>
                <Text style={styles.badge}>{currentService.category}</Text>
              </View>
              {currentService.skills && currentService.skills.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.skillsTitle}>Required Skills</Text>
                  <View style={styles.skillsRow}>
                    {currentService.skills.map((skill, idx) => (
                      <Text key={idx} style={styles.skillBadge}>{skill}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
          {subcontractor && (
            <TouchableOpacity style={styles.cardSection} onPress={() => setIsModalOpen(true)}>
              <Text style={styles.sectionTitle}>Subcontractor Profile</Text>
              <Text style={styles.subcontractorName}>{subcontractor.full_name || subcontractor.username}</Text>
              <Text style={styles.sectionText}>Email: {subcontractor.email}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Review Actions</Text>
          {currentJob.freelancer_id ? (
            <>
              <TouchableOpacity
                style={[styles.primaryButton, currentJob.status !== 'Pending' && styles.disabledButton]}
                onPress={handleApprove}
                disabled={currentJob.status !== 'Pending'}
              >
                <Text style={styles.primaryButtonText}>Approve Subcontractor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, currentJob.status !== 'Pending' && styles.disabledButton]}
                onPress={handleReject}
                disabled={currentJob.status !== 'Pending'}
              >
                <Text style={styles.outlineButtonText}>Reject Subcontractor</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.infoText}>No subcontractor assigned yet.</Text>
          )}
        </View>
      </View>

      {/* Subcontractor Profile Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{subcontractor?.full_name || subcontractor?.username}'s Profile</Text>
            <Text style={styles.modalLabel}>Full Name</Text>
            <Text style={styles.modalValue}>{subcontractor?.full_name || 'Not provided'}</Text>
            <Text style={styles.modalLabel}>Username</Text>
            <Text style={styles.modalValue}>{subcontractor?.username}</Text>
            <Text style={styles.modalLabel}>Email</Text>
            <Text style={styles.modalValue}>{subcontractor?.email}</Text>
            <Text style={styles.modalLabel}>Role</Text>
            <Text style={styles.modalValue}>{subcontractor?.role || 'Not provided'}</Text>
            <Text style={styles.modalLabel}>Curriculum Vitae</Text>
            {subcontractor?.cvurl ? (
              <TouchableOpacity onPress={() => setIsCvViewerOpen(true)}>
                <Text style={styles.cvLink}>View CV</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.infoText}>No CV uploaded</Text>
            )}
            {userSkills && userSkills.length > 0 && (
              <>
                <Text style={styles.modalLabel}>Skills</Text>
                <View style={styles.skillsRow}>
                  {userSkills.map((skill, idx) => (
                    <Text key={idx} style={styles.skillBadge}>{skill.name}</Text>
                  ))}
                </View>
              </>
            )}
            {subcontractor?.bio && (
              <>
                <Text style={styles.modalLabel}>Professional Summary</Text>
                <Text style={styles.modalValue}>{subcontractor.bio}</Text>
              </>
            )}
            <TouchableOpacity style={styles.outlineButton} onPress={() => setIsModalOpen(false)}>
              <Text style={styles.outlineButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CV Viewer Modal */}
      <Modal visible={isCvViewerOpen} animationType="slide" transparent onRequestClose={() => setIsCvViewerOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>CV Preview</Text>
            <Text style={styles.infoText}>CV preview is not supported in this mobile version.</Text>
            <TouchableOpacity style={styles.outlineButton} onPress={() => setIsCvViewerOpen(false)}>
              <Text style={styles.outlineButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f5f3ff' },
  container: { padding: 16 },
  section: { marginBottom: 24 },
  actionsSection: { marginBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', width: '90%', elevation: 3 },
  denyTitle: { fontSize: 20, fontWeight: 'bold', color: '#dc2626', marginBottom: 8 },
  denyDesc: { color: '#6b7280', marginBottom: 16, textAlign: 'center' },
  loadingTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  notFoundTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  notFoundDesc: { fontSize: 16, color: '#6b7280', marginBottom: 16 },
  primaryButton: { backgroundColor: '#a78bfa', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  outlineButton: { borderWidth: 1, borderColor: '#a78bfa', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  outlineButtonText: { color: '#7c3aed', fontWeight: 'bold', fontSize: 16 },
  disabledButton: { opacity: 0.5 },
  backLink: { color: '#a78bfa', marginBottom: 8, fontWeight: 'bold' },
  badge: { backgroundColor: '#ede9fe', color: '#7c3aed', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, alignSelf: 'flex-start', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  infoText: { color: '#6b7280', marginRight: 16, fontSize: 14 },
  cardSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#7c3aed', marginBottom: 8 },
  sectionText: { color: '#374151', fontSize: 15, marginBottom: 8 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  skillsTitle: { fontSize: 15, fontWeight: 'bold', color: '#7c3aed', marginBottom: 4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  skillBadge: { backgroundColor: '#ede9fe', color: '#7c3aed', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, marginRight: 8, marginBottom: 4 },
  subcontractorName: { fontSize: 16, fontWeight: 'bold', color: '#7c3aed', marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '90%', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#7c3aed' },
  modalLabel: { fontWeight: 'bold', color: '#374151', marginTop: 8, marginBottom: 4 },
  modalValue: { color: '#374151', marginBottom: 4 },
  cvLink: { color: '#9980F2', fontWeight: 'bold', marginBottom: 8 },
});

export default JobAssignmentPage;
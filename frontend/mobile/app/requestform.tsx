import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/redux/store';
import { createServiceRequest } from '../src/redux/slices/service_requestSlice';

interface RequestFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  id: any;
}

const RequestForm: React.FC<RequestFormProps> = ({ isOpen, onOpenChange, service, id }) => {
  const [proposedPrice, setProposedPrice] = useState('');
  const [description, setDescription] = useState(service?.description || '');
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!isAuthenticated || !user?.id || !id) {
      Alert.alert('Error', 'You must be logged in to submit a request.');
      return;
    }
    try {
      await dispatch(createServiceRequest({
        service_id: Number(id),
        subcontractor_id: Number(user.id),
        message: description,
        proposed_price: Number(proposedPrice) || 0
      })).unwrap();
      Alert.alert('Request Submitted', 'Your service request has been sent for approval.');
      onOpenChange(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the request. Please try again.');
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => onOpenChange(false)}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Make a Service Request</Text>
          <Text style={styles.label}>Request Message</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Describe your request..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.label}>Proposed Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your proposed price"
            value={proposedPrice}
            onChangeText={setProposedPrice}
            keyboardType="numeric"
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.outlineButton} onPress={() => onOpenChange(false)}>
              <Text style={styles.outlineButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '90%', elevation: 5 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#9980F2' },
  label: { fontWeight: 'bold', color: '#374151', marginTop: 8, marginBottom: 4 },
  textarea: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, minHeight: 80, marginBottom: 8, textAlignVertical: 'top' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  outlineButton: { borderWidth: 1, borderColor: '#9980F2', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginRight: 8, flex: 1 },
  outlineButtonText: { color: '#9980F2', fontWeight: 'bold', fontSize: 16 },
  primaryButton: { backgroundColor: '#9980F2', borderRadius: 8, paddingVertical: 12, alignItems: 'center', flex: 1 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default RequestForm;
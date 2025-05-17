import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/redux/store';
import JobCard from './jobcard';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  service_id: number;
  client_requirements?: string;
  client_id: number | null;
  freelancer_id: number | null;
  service_request_id?: number | null;
  created_at: string;
  updated_at: string;
}

interface JobsGridProps {
  jobs: Job[];
  onJobPress?: (job: Job) => void;
}

const JobsGrid: React.FC<JobsGridProps> = ({ jobs, onJobPress }) => {
  const dispatch = useDispatch();
  const services = useSelector((state: RootState) => state.services.services);

  // Helper to get service by id from redux state
  const getServiceById = (id: number) => services.find((s) => s.id === id);

  const numColumns = 2;

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id?.toString() ?? String(Math.random())}
      renderItem={({ item }) => {
        const service = getServiceById(item.service_id);
        return (
          <View style={styles.cardWrapper}>
            <TouchableOpacity activeOpacity={0.85} onPress={onJobPress ? () => onJobPress(item) : undefined}>
              {/* Optionally display service info here, or just pass job to JobCard */}
              <JobCard job={item} service={service} />
              {/* Example: <Text>{service?.title}</Text> */}
            </TouchableOpacity>
          </View>
        );
      }}
      contentContainerStyle={styles.container}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      key={numColumns}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  cardWrapper: {
    flex: 0.5, // Allow two columns
    marginBottom: 12,
    paddingHorizontal: 4, // Add horizontal padding for spacing
  },
});

export default JobsGrid;

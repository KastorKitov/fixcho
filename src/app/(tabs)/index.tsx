import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';
import { Job, useJobs } from '../../hooks/useJobs';
import { Image } from "expo-image";
import { formatTimeAgo } from '../../lib/date-helper';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {

  return (
    <View style={styles.jobItemContainer}>
      <View style={styles.jobContentContainer}>
        {job.image_url ? (
          <Image source={{ uri: job.image_url }} style={styles.jobImage} />
        ) : (
          <Image source={require('../../../assets/myicon/no_job_photo.png')} style={styles.jobImage} />
        )}
        <View style={styles.jobTextContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          {job.negotiable ?
            <Text style={styles.jobSubText}>Negotiable</Text> :
            <Text style={styles.jobPrice}>
              {`${job.min_price ?? 0}€ - ${job.max_price ?? 0}€`}
            </Text>
          }
          <Text style={styles.jobDescription} numberOfLines={3} ellipsizeMode="tail">
            {job.description || ""}
          </Text>
          <Text style={styles.jobSubText}>{job.location}</Text>
          <Text style={styles.jobSubText}>{formatTimeAgo(job.created_at)}</Text>
        </View>
      </View>
    </View>
  );
};

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);


  const router = useRouter();
  const { jobs, refreshJobs } = useJobs();

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      await refreshJobs();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderJob = ({ item }: { item: Job }) => (
    <JobCard job={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.jobHeader}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Available Jobs</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No jobs found</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <TouchableOpacity style={styles.plusButton} onPress={() => router.push('/(job)/addJob')}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  plusButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.button,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowColor: Colors.button,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  plusButtonText: {
    fontSize: 38,
    color: Colors.buttonText,
    lineHeight: 32,
    fontWeight: "300",
  },
  //car
  jobItemContainer: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  jobHeader: {
    backgroundColor: Colors.button,
    padding: 5,
    alignItems: 'center',
  },
  jobContentContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  jobImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginRight: 10,
  },
  jobTextContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  jobSubText: {
    fontSize: 12,
    color: '#999'
  },
  jobDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
  }
});

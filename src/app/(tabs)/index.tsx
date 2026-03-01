import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';
import { Job, useJobs } from '../../hooks/useJobs';
import { Image } from "expo-image";
import { formatTimeAgo } from '../../lib/date-helper';

export default function Index() {
  const router = useRouter();
  const { jobs } = useJobs();

  interface JobCardProps {
    job: Job;
  }

  const JobCard = ({ job }: JobCardProps) => {

    return (
      <View style={styles.jobItemContainer}>
        <View style={styles.jobContentContainer}>
          <Image source={{ uri: job.image_url }} style={styles.jobImage} />
          <View style={styles.jobTextContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobPrice}>{job.min_price + "€ - " + job.max_price + "€"}</Text>
            <Text style={styles.jobDescription}>{job.description || ""}</Text>
            <Text style={styles.jobSubText}>{job.location}</Text>
            <Text style={styles.jobSubText}>{formatTimeAgo(job.created_at)}</Text>
          </View>
        </View>
      </View>
    );
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
    flexDirection: 'row', // This makes the image and text align side by side
    padding: 10,
    alignItems: 'center', // Vertically center the image and text
  },
  jobImage: {
    width: 100,  // Adjust the width of the image
    height: 100, // Adjust the height of the image
    resizeMode: 'cover',
    marginRight: 10, // Add some space between the image and text
  },
  jobTextContainer: {
    flex: 1, // Ensures the text takes up the remaining space
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

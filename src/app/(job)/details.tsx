import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useJobs } from "../../hooks/useJobs";
import { Image } from "expo-image";
import { Colors } from "../../constants/colors";
import { formatTimeAgo } from "../../lib/date-helper";
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JobDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { jobs, deactivateJob } = useJobs();
    const { user } = useAuth();

    const job = jobs.find((j) => j.id === id);
    const isOwner = job?.user_id === user?.id;
    const router = useRouter();

    if (!job) {
        return (
            <View style={styles.center}>
                <Text>Job not found</Text>
            </View>
        );
    }

    const handleEmail = () => {
        Linking.openURL(`mailto:${job.email}`);
    };

    const handlePhone = () => {
        Linking.openURL(`tel:${job.phone_number}`);
    };

    const handleEdit = () => {
        // navigate to edit screen
        // example route: /job/edit/[id]
        router.push({
            pathname: "/job/edit/[id]",
            params: { id: job.id },
        });
    };

    const handleDeactivate = () => {
        Alert.alert(
            "Deactivate Job",
            "Are you sure you want to deactivate this job?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Deactivate",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deactivateJob(job.id);
                            router.replace("/(tabs)");
                        } catch (error) {
                            Alert.alert("Error", "Failed to deactivate job.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
            <Stack.Screen
                options={{
                    title: "Job Details",
                    headerStyle: { backgroundColor: "#fff" },
                    headerTitleStyle: { fontWeight: "bold" },
                }}
            />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* HERO IMAGE */}
                <Image
                    source={
                        job.image_url
                            ? { uri: job.image_url }
                            : require("../../../assets/myicon/no_job_photo.png")
                    }
                    style={styles.image}
                    contentFit="cover"
                    transition={500}
                />

                <View style={styles.content}>
                    {/* TITLE */}
                    <Text style={styles.title}>{job.title}</Text>

                    {/* CATEGORY */}
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{job.category}</Text>
                    </View>

                    {/* PRICE */}
                    <View style={styles.priceContainer}>
                        {job.negotiable ? (
                            <Text style={styles.negotiable}>💬 Negotiable</Text>
                        ) : (
                            <Text style={styles.price}>
                                💰 {job.min_price ?? 0}€ - {job.max_price ?? 0}€
                            </Text>
                        )}
                    </View>

                    {/* LOCATION & DATE */}
                    <Text style={styles.meta}>📍 {job.location}</Text>
                    <Text style={styles.meta}>
                        🕒 {formatTimeAgo(job.created_at)}
                    </Text>

                    {/* DESCRIPTION */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{job.description}</Text>

                    {/* CONTACT SECTION */}
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.contactCard}>
                        <Text style={styles.contactName}>{job.contact_name}</Text>

                        <TouchableOpacity onPress={handleEmail}>
                            <Text style={styles.contactItem}>📧 {job.email}</Text>
                        </TouchableOpacity>

                        {job.phone_number ? (
                            <TouchableOpacity onPress={handlePhone}>
                                <Text style={styles.contactItem}>
                                    📱 {job.phone_number}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    {isOwner && (
                        <View style={styles.ownerActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={handleEdit}
                            >
                                <Text style={styles.actionText}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.deactivateButton]}
                                onPress={handleDeactivate}
                            >
                                <Text style={styles.actionText}>Deactivate</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    image: {
        width: "100%",
        height: 260,
    },

    content: {
        padding: 20,
        marginBottom: 60
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#222",
    },

    categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: Colors.button,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15,
    },

    categoryText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    priceContainer: {
        marginBottom: 10,
    },

    price: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2e7d32",
    },

    negotiable: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ff9800",
    },

    meta: {
        fontSize: 13,
        color: "#666",
        marginBottom: 5,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
        color: "#222",
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#444",
    },

    contactCard: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        borderRadius: 12,
        marginTop: 5,
    },

    contactName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#222",
    },

    contactItem: {
        fontSize: 14,
        color: Colors.button,
        marginBottom: 6,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    ownerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
    },

    actionButton: {
        flex: 0.48,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    editButton: {
        backgroundColor: Colors.button
    },

    deactivateButton: {
        backgroundColor: Colors.deleteButton
    },

    actionText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

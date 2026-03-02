import { useAuth } from "../../context/AuthContext";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { uploadProfileImage } from "../..//lib/supabase/storage";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Job, useJobs } from "../../hooks/useJobs";

const MyJobCard = ({ job }: { job: Job }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/(job)/details",
                    params: { id: job.id },
                })
            }
        >
            <View style={styles.myJobCard}>
                <Image
                    source={
                        job.image_url
                            ? { uri: job.image_url }
                            : require("../../../assets/myicon/no_job_photo.png")
                    }
                    style={styles.myJobImage}
                />

                <View style={{ flex: 1 }}>
                    <Text style={styles.myJobTitle}>{job.title}</Text>

                    <Text style={styles.myJobMeta}>
                        {job.negotiable
                            ? "Negotiable"
                            : `${job.min_price ?? 0}€ - ${job.max_price ?? 0}€`}
                    </Text>

                    <Text style={styles.myJobMeta}>
                        {job.is_active ? "🟢 Active" : "🔴 Inactive"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function Profile() {
    const { user, updateUser, signOut } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const { userJobs } = useJobs();

    const handleUpdateProfileImage = async () => {
        if (!user) return;
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission needed",
                "We need camera roll permissions to select a profile image.",
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setIsUpdating(true);
            try {
                const imageUrl = await uploadProfileImage(
                    user.id,
                    result.assets[0].uri,
                );

                await updateUser({ profileImage: imageUrl });
                Alert.alert("Success", "Profile image updated.");
            } catch (error) {
                console.error("Error updating profile image:", error);
                Alert.alert(
                    "Error",
                    "Failed to update profile image. Please try again.",
                );
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleSignOut = async () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        onPress={handleUpdateProfileImage}
                        disabled={isUpdating}
                    >
                        <View>
                            {user?.profileImage ? (
                                <Image
                                    source={{ uri: user.profileImage }}
                                    style={styles.profileImage}
                                    cachePolicy={"none"}
                                />
                            ) : (
                                <View
                                    style={[styles.profileImage, styles.profileImagePlaceholder]}
                                >
                                    <Text style={styles.profileImageText}>
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.editBadge}>
                                <Text style={styles.editBadgeText}>Edit</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.name}>{user?.name || "No Name"}</Text>
                    <Text style={styles.username}>@{user?.username || "user"}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Edit Profile</Text>
                        <Text style={styles.settingValue}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.settingItem, styles.signOutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Jobs</Text>

                    {userJobs.length === 0 ? (
                        <Text style={{ color: "#999" }}>You have not posted any jobs yet.</Text>
                    ) : (
                        userJobs.map((job) => <MyJobCard key={job.id} job={job} />)
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 32,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 32,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    profileImagePlaceholder: {
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    profileImageText: {
        fontSize: 40,
        fontWeight: "600",
        color: "#666",
    },
    editBadge: {
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: [{ translateX: -22 }],
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    editBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#000",
    },
    username: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#999",
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        color: "#000",
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        marginBottom: 8,
    },
    settingLabel: {
        fontSize: 18,
        color: "#999",
    },
    settingValue: {
        fontSize: 18,
        color: "#999",
    },
    signOutButton: {
        backgroundColor: "#f5f5f5",
        marginBottom: 8,
    },
    signOutText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },
    deleteButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ff3b30",
    },
    deleteText: {
        fontSize: 16,
        color: "#ff3b30",
        fontWeight: "500",
    },
    myJobCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        marginBottom: 10,
    },

    myJobImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },

    myJobTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },

    myJobMeta: {
        fontSize: 13,
        color: "#666",
    },
});
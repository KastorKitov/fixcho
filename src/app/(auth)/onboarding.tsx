import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { supabase } from "../../lib/supabase/client";
import { uploadProfileImage } from "../../lib/supabase/storage";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from "expo-router";
import { Colors } from '../../constants/colors';

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const [role, setRole] = useState('user');

  const router = useRouter();

  const handleRoleChange = (selectedRole: any) => {
    setRole(selectedRole);
  };

  const pickImage = async () => {
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
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera permissions to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const handleComplete = async () => {
    if (!name || !username) {
      Alert.alert("Error", "Please fill in all fields");
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
    }

    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      // Check if username exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        Alert.alert(
          "Error",
          "This username is already taken. Please choose another one.",
        );
        setIsLoading(false);
        return;
      }

      //Upload profile img
      let profileImageUrl: string | undefined;
      if (profileImage) {
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          Alert.alert(
            "Warning",
            "Failed to upload profile image. Continuing without image.",
          );
        }
      }

      //Update profile
      await updateUser({
        name,
        username,
        email: user.email,
        profileImage: profileImageUrl,
        onboardingCompleted: true,
        role: role
      });

      router.replace("/(tabs)");

    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to complete the onboarding. Please try again.",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Add your information to get started
          </Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={showImagePicker}
          >
            {profileImage ? (
              <Image
                cachePolicy={"none"}
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>+</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={Colors.placeholderText}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.placeholderText}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username"
          />
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.radioTitleText}>I am:</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[styles.box, role === 'user' && styles.selectedBox]}
                onPress={() => handleRoleChange('user')}
              >
                <Text style={[styles.label, role === 'user' && styles.selectedText]}>User</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.box, role === 'professional' && styles.selectedBox]}
                onPress={() => handleRoleChange('professional')}
              >
                <Text style={[styles.label, role === 'professional' && styles.selectedText]}>Professional</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button}
            onPress={handleComplete}
          >
            {isLoading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  header: {
    marginBottom: 32
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: Colors.subtitle
  },
  form: {
    width: "100%",
    alignItems: "center"
  },
  imageContainer: {
    marginBottom: 32,
    position: "relative"
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.inputFieldBackground
  },
  placeholderImage: {
    width: 120,
    height: 120,
    backgroundColor: Colors.inputFieldBackground,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: Colors.inputFieldBorder,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 48,
    color: Colors.placeholderText,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.button,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#666",
    fontSize: 14,
  },
  linkButtonTextBold: {
    fontWeight: "600",
    color: "#000",
  },
  //role
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  box: {
    width: 150,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    // transition: 'transform 250ms ease',
    elevation: 1, // Shadow effect for Android
    //position: 'relative',
  },
  selectedBox: {
    backgroundColor: "#9eb40a"
  },
  label: {
    fontSize: 16,
    color: Colors.button,
    fontWeight: "600",
  },
  selectedText: {
    fontSize: 16,
    color: '#fff',
  },
  radioTitleText: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10,
    color: "#666"
  }
});
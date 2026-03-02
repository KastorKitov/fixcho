import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { supabase } from "../../lib/supabase/client";
import { uploadProfileImage } from "../../lib/supabase/storage";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState("user");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setProfileImage(user.profileImage || null);
      setRole(user.role || "user");
      setLocation(user.location || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permissions to select a profile image."
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

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9._]+$/.test(cleanUsername)) {
      Alert.alert(
        "Invalid username",
        "Username can only contain letters, numbers, dots and underscores."
      );
      return;
    }

    if (!location.trim()) {
      Alert.alert("Error", "Location is required");
      return;
    }

    if (!isValidPhone(phoneNumber.trim())) {
      Alert.alert("Error", "Invalid phone number");
      return;
    }

    setIsLoading(true);

    try {
      if (!user) throw new Error("User not authenticated");

      // Check username uniqueness
      const usernameChanged = cleanUsername !== user.username;
      if (usernameChanged) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", cleanUsername)
          .neq("id", user.id)
          .maybeSingle();

        if (existingUser) {
          Alert.alert(
            "Error",
            "This username is already taken. Please choose another one."
          );
          setIsLoading(false);
          return;
        }
      }

      let profileImageUrl = profileImage;

      if (profileImage && profileImage.startsWith("file")) {
        profileImageUrl = await uploadProfileImage(
          user.id,
          profileImage
        );
      }

      await updateUser({
        name: name.trim(),
        username: username.trim(),
        profileImage: profileImageUrl ?? undefined,
        role,
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      Alert.alert("Success", "Profile updated successfully.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Your Profile</Text>
            <Text style={styles.subtitle}>
              Update your information below
            </Text>
          </View>

          <View style={styles.form}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={pickImage}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  cachePolicy={"none"}
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
              autoCorrect={false}
              spellCheck={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor={Colors.placeholderText}
              value={location}
              onChangeText={setLocation}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={Colors.placeholderText}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoCorrect={false}
              spellCheck={false}
            />

            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text style={styles.radioTitleText}>I am:</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.box,
                    role === "user" && styles.selectedBox,
                  ]}
                  onPress={() => handleRoleChange("user")}
                >
                  <Text
                    style={[
                      styles.label,
                      role === "user" && styles.selectedText,
                    ]}
                  >
                    User
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.box,
                    role === "professional" && styles.selectedBox,
                  ]}
                  onPress={() =>
                    handleRoleChange("professional")
                  }
                >
                  <Text
                    style={[
                      styles.label,
                      role === "professional" &&
                      styles.selectedText,
                    ]}
                  >
                    Professional
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={24} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    padding: 24,
    paddingBottom: 50,
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
    color: "#000"
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
    backgroundColor: "#8089d2"
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
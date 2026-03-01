import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as ImagePicker from "expo-image-picker";
import { useJobs } from '../../hooks/useJobs';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';

export default function AddJob() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [negotiable, setNegotiable] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  const { createJob } = useJobs();
  const router = useRouter();

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
      setImage(result.assets[0].uri);
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
      //allowsEditing: true,
      // aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, '')) || 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    if (!phone) return true; // optional field
    const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
    return phoneRegex.test(phone);
  };

const validateFields = () => {
  const trimmedTitle = title.trim();
  const trimmedCategory = category.trim();
  const trimmedDescription = description.trim();
  const trimmedEmail = email.trim();

  if (!trimmedTitle) {
    Alert.alert("Title Required", "Please enter a job title.");
    return false;
  }

  if (trimmedTitle.length < 6) {
    Alert.alert("Title Too Short", "Title must be at least 6 characters long.");
    return false;
  }

  if (!trimmedCategory) {
    Alert.alert("Category Required", "Please enter a category.");
    return false;
  }

  if (trimmedCategory.length < 6) {
    Alert.alert("Category Too Short", "Category must be at least 6 characters long.");
    return false;
  }

  if (!trimmedDescription) {
    Alert.alert("Description Required", "Please enter a description.");
    return false;
  }

  if (trimmedDescription.length < 12) {
    Alert.alert("Description Too Short", "Description must be at least 12 characters long.");
    return false;
  }

  if (!trimmedEmail) {
    Alert.alert("Email Required", "Please enter your email.");
    return false;
  }

  if (!isValidEmail(trimmedEmail)) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return false;
  }

  if (!isValidPhone(phoneNumber)) {
    Alert.alert("Invalid Phone", "Please enter a valid phone number.");
    return false;
  }

  if (!negotiable) {
    const min = parseNumber(minPrice);
    const max = parseNumber(maxPrice);

    if (!maxPrice || max === 0) {
      Alert.alert("Price Required", "Please enter at least a maximum price.");
      return false;
    }

    if (min < 0 || max < 0) {
      Alert.alert("Invalid Price", "Price cannot be negative.");
      return false;
    }

    if (min > max) {
      Alert.alert("Invalid Price", "Minimum price cannot be greater than maximum price.");
      return false;
    }

    if (max > 10000000) {
      Alert.alert("Invalid Price", "Maximum price is too high.");
      return false;
    }
  }

  return true;
};

  const handleAddJob = async () => {

    const isValid = validateFields();
    if (!isValid) return;

    try {
      await createJob(title, email, image || '', category, description, location, negotiable, minPrice, maxPrice, contactName, phoneNumber);
      setTitle('');
      setCategory('');
      setDescription('');
      setLocation('');
      setMinPrice('');
      setMaxPrice('');
      setContactName('');
      setEmail('');
      setPhoneNumber('');
      setPriceRange([0, 0]);
      setImage(null);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "There was an error adding your job. Please try again.");
      return;
    }

    Alert.alert("Job Added", "Your job has been successfully added!");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        bottomOffset={10}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>What do you offer?</Text>

        {/* Image Container */}
        <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.addImageButton}>
              <Text style={styles.addImageText}>Add Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Title*"
          value={title}
        />
        <Text style={styles.helperText}>Minimum 6 characters</Text>
        <TextInput
          style={styles.input}
          placeholder="Category*"
          value={category}
        />
        <Text style={styles.helperText}>Minimum 6 characters</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Description*"
          value={description}
          multiline
          maxLength={700}
        />
        <Text style={styles.helperText}>Minimum 12 characters</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        {/* PRICE SECTION */}
        <Text style={styles.sectionLabel}>Price Range</Text>

        {/* Negotiable Toggle */}
        <View style={styles.negotiableRow}>
          <Text style={styles.negotiableText}>Negotiable</Text>
          <Switch
            value={negotiable}
            onValueChange={setNegotiable}
            thumbColor={Colors.button}
          />
        </View>

        {!negotiable && (
          <>
            {/* Inputs */}
            <View style={styles.priceRow}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currency}>€</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={minPrice}
                  onChangeText={(text) => {
                    const formatted = formatNumber(text);
                    setMinPrice(formatted);
                    setPriceRange([parseNumber(formatted), priceRange[1]]);
                  }}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.priceInputWrapper}>
                <Text style={styles.currency}>€</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={maxPrice}
                  onChangeText={(text) => {
                    const formatted = formatNumber(text);
                    setMaxPrice(formatted);
                    setPriceRange([priceRange[0], parseNumber(formatted)]);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Slider */}
            <Slider
              style={{ width: '100%', height: 40, }}
              minimumTrackTintColor={Colors.button}
              thumbTintColor={Colors.button}
              minimumValue={0}
              maximumValue={10000}
              step={50}
              value={priceRange[0]}
              onValueChange={(value) => {
                setPriceRange([value, priceRange[1]]);
                setMinPrice(formatNumber(String(value)));
              }}
            />

            <Slider
              style={{ width: '100%', height: 40 }}
              minimumTrackTintColor={Colors.button}
              thumbTintColor={Colors.button}
              minimumValue={0}
              maximumValue={10000}
              step={50}
              value={priceRange[1]}
              onValueChange={(value) => {
                setPriceRange([priceRange[0], value]);
                setMaxPrice(formatNumber(String(value)));
              }}
            />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          value={contactName}
          onChangeText={setContactName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email*"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Add Job Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddJob}>
          <Text style={styles.addButtonText}>Add Job</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40, // To ensure content at the bottom is not hidden
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#333",
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addImageButton: {
    backgroundColor: Colors.button,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  addImageText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.inputFieldBackground,
    borderColor: Colors.inputFieldBorder,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1
  },
  textArea: {
    height: 100,
    backgroundColor: Colors.inputFieldBackground,
    borderColor: Colors.inputFieldBorder,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: Colors.button,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
    color: '#333',
  },

  negotiableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  negotiableText: {
    fontSize: 16,
    color: '#333',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputFieldBackground,
    borderColor: Colors.inputFieldBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 0.48,
  },

  currency: {
    fontSize: 16,
    marginRight: 6,
    color: '#666',
  },

  priceInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: -12,
    marginBottom: 12,
  }
});
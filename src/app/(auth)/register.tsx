import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase/client';

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        // 1. Email Validation (Regex)
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailRegex.test(email)) {
            Alert.alert("Invalid email", "Please provide a valid email address.");
            return;
        }

        // 2. Password Validation (Min Length, At least one number, At least one special character)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-]).{6,}$/;
        // This regex ensures:
        // - At least one letter
        // - At least one number
        // - At least one special character
        // - Minimum length of 6 characters
        if (!password || password.length < 6) {
            Alert.alert("Password too short", "Password must be at least 6 characters long.");
            return;
        }

        if (!passwordRegex.test(password)) {
            Alert.alert("Password complexity", "Password must include at least one letter, one number, and one special character.");
            return;
        }

        // 3. Confirm Password Validation (Must match the password)
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match", "Please make sure the passwords match.");
            return;
        }

        // 4. Check if email is already in use
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .maybeSingle();
        if (error) {
            throw error;
        }
        if (data) {
            Alert.alert("Email already in use", "Please use a different email address.");
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password);
            router.push('/(auth)/onboarding');
        } catch (error) {
            console.error(error);
            Alert.alert("Sign up failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.imageContainer}>
                    <Image source={require("../../../assets/myicon/fixcho_logo_1.png")} style={{ width: 400, height: 200 }} />
                </View>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Sign Up to Get Started</Text>
                <View style={styles.inputForm}>
                    <TextInput
                        placeholder="Email..."
                        placeholderTextColor={Colors.placeholderText}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={Colors.placeholderText}
                        autoComplete="password"
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.placeholderText}
                        autoComplete="password"
                        secureTextEntry
                        autoCapitalize="none"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.inputField}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                    {isLoading ? (<ActivityIndicator color="#fff" size={24} />) : (<Text style={styles.loginButtonText}>Sign Up</Text>)}
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpText} onPress={() => router.back()}>
                    <Text style={styles.signUpButtonText}>Already have an account? <Text style={styles.signUpButtonTextBold}>Sign In</Text></Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        paddingBottom: 120, // To ensure content at the bottom is not hidden
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 32
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 18,
        color: Colors.subtitle
    },
    inputForm: {
        width: "100%"
    },
    inputField: {
        backgroundColor: Colors.inputFieldBackground,
        borderColor: Colors.inputFieldBorder,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    loginButton: {
        backgroundColor: Colors.button,
        borderRadius: 12,
        padding: 16,
        alignItems: "center"
    },
    loginButtonText: {
        color: Colors.buttonText,
        fontSize: 16,
        fontWeight: "600"
    },
    signUpText: {
        marginTop: 24,
        alignItems: "center"
    },
    signUpButtonText: {
        color: Colors.subtitle,
        fontSize: 14
    },
    signUpButtonTextBold: {
        fontWeight: "600",
        color: Colors.primaryBlack
    }
});

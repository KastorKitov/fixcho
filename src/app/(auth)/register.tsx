import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { signUp } = useAuth();

    //hack
    // useEffect(() => {
    //     router.replace("/(auth)/onboarding");
    // }, []);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Please fill in all fields");
            return;
        }

        if (password.length < 3) {
            Alert.alert("Password must be at least 3 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password);
            Alert.alert("Sign up successful! Please check your email to confirm your account.");
            //router.replace('/(auth)/login');
        } catch (error) {
            console.error("Sign up error:", error);
            Alert.alert("Sign up failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image source={require("../../../assets/myicon/fixcho_logo_1.png")} style={{ width: 400, height: 200 }} />
                </View>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Sign Up to Get Started</Text>
                <View style={styles.inputForm}>
                    <TextInput
                        placeholder="Email..."
                        placeholderTextColor={"gray"}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        autoComplete="password"
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputField}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                    {isLoading ? (<ActivityIndicator color="#fff" size={24} />) : (<Text style={styles.loginButtonText}>Sign Up</Text>)}
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpText} onPress={() => router.back()}>
                    <Text style={styles.signUpButtonText}>Already have an account? <Text style={styles.signUpButtonTextBold}>Sign In</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24
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
        color: "#666"
    },
    inputForm: {
        width: "100%"
    },
    inputField: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0"
    },
    loginButton: {
        backgroundColor: "#000",
        borderRadius: 12,
        padding: 16,
        alignItems: "center"
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    signUpText: {
        marginTop: 24,
        alignItems: "center"
    },
    signUpButtonText: {
        color: "#666",
        fontSize: 14
    },
    signUpButtonTextBold: {
        fontWeight: "600",
        color: "#000"
    }
});

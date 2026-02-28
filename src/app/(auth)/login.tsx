import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email, password);
            router.push('/(tabs)');
        } catch (error) {
            console.error(error);
            Alert.alert("Sign in failed. Please try again.");
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
                <View style={styles.imageContainer}>
                    <Image source={require("../../../assets/myicon/fixcho_logo_1.png")} style={{ width: 400, height: 200 }} />
                </View>
                <Text style={styles.subtitle}>Sign In to Continue</Text>
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
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    {isLoading ? (
                        <ActivityIndicator color={Colors.buttonText} />
                    ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpText} onPress={() => router.push("/(auth)/register")}>
                    <Text style={styles.signUpButtonText}>Don't have an account? <Text style={styles.signUpButtonTextBold}>Sign Up</Text></Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        padding: 24
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 32
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 6,
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
        borderWidth: 1
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
        color: Colors.primaryBlack,
    }
});

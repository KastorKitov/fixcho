import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign In to Continue</Text>
                <View style={styles.inputForm}>
                    <TextInput
                        placeholder="Email..."
                        placeholderTextColor={"gray"}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        autoComplete="password"
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.inputField}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={() => console.log("log in pressed")}>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpText} onPress={() => router.push("/(auth)/register")}>
                    <Text style={styles.signUpButtonText}>Don't have an account? <Text style={styles.signUpButtonTextBold}>Sign Up</Text></Text>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
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

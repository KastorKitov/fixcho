import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Colors } from '../constants/colors';

function RouteGuard() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const segments = useSegments();

    const inAuthRoute = segments[0] === "(auth)";

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            if (!inAuthRoute) {
                router.replace('/(auth)/login');
            }
            return;
        }

        if (!user.onboardingCompleted) {
            if (segments.join("/") !== "(auth)/onboarding") {
                router.replace("/(auth)/onboarding");
            }
            return;
        }

        if (inAuthRoute) {
            router.replace('/(tabs)');
        }

    }, [segments, user, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardProvider>
            <StatusBar backgroundColor={Colors.button} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(job)" />
                <Stack.Screen name="(profile)" />
            </Stack>
        </KeyboardProvider>
    )
}

export default function RootLayout() {

    return (
        <AuthProvider>
            <RouteGuard />
        </AuthProvider>
    );
}
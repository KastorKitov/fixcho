import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RouteGuard() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const segments = useSegments();

    const inAuthRoute = segments[0] === "(auth)";
    const inTabsRoute = segments[0] === "(tabs)";
    const inJobRoute = segments[0] === "(job)";

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            if (!inAuthRoute) {
                router.replace('/(auth)/login');
            }
        } else if (!user.onboardingCompleted) {
            if (segments.join("/") !== "(auth)/onboarding") {
                router.replace("/(auth)/onboarding");
            }
        } else {
            if(inJobRoute) {
            } else if (!inTabsRoute) {
                router.replace('/(tabs)');
            }
        }
    }, [segments, user, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(job)" />
            </Stack>
        </SafeAreaView>
    )
}

export default function RootLayout() {

    return (
        <AuthProvider>
            <RouteGuard />
        </AuthProvider>
    );
}
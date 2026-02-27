import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const isAuthenticated = false; // This should ideally come from context or a state management solution.

    useEffect(() => {
        // Ensure that the router is fully ready before performing navigation
        if (isReady) {
            if (isAuthenticated) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [isReady]); // Trigger only after the router is ready

    useEffect(() => {
        // Mark the router as ready after the component mounts
        setIsReady(true);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </SafeAreaView>
    );
}
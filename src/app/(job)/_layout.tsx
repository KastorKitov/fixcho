import { HeaderTitle } from '@react-navigation/elements';
import { Stack } from 'expo-router';

export default function JobLayout() {
    return (
        <Stack>
            <Stack.Screen name="addJob" options={{
                title: "Add Job",
            }
            } />
        </Stack>
    );
}
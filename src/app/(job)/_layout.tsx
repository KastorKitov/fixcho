import { HeaderTitle } from '@react-navigation/elements';
import { Stack } from 'expo-router';

export default function JobLayout() {
    return (
        <Stack>
            <Stack.Screen name="addJob" options={{
                title: "Add Job",
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: "#000",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }
            } />
            <Stack.Screen
                name="details"
                options={{
                    title: "Job Details",
                    headerStyle: {
                        backgroundColor: "#fff",
                    },
                    headerTintColor: "#000",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            />
        </Stack>

    );
}
import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="editProfile"
                options={{
                    title: "Edit Profile",
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
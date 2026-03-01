import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/colors';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.button,
            headerShown: false,
            tabBarStyle: {
                height: 70,
            },
        }}>
            <Tabs.Screen name="index"
                options={{
                    title: "Jobs",
                    tabBarIcon: ({ color, size, focused }) => <MaterialIcons name={focused ? "work" : "work-outline"} size={20} color={color} />
                }}
            />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={20} color={color} />
            }}
            />
        </Tabs>
    )
}
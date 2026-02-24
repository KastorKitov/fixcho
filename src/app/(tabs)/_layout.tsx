import { Tabs } from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "coral"}}>
            <Tabs.Screen name="index" 
            options={{
                title: "first page",
                tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            }} />
            <Tabs.Screen name="secondPage" options={{ 
                title: "second page",
                tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={size} color={color} />
            }} />
            <Tabs.Screen name="thirdPage" options={{ 
                title: "third page", 
                tabBarIcon: ({color, size, focused}) => <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} /> }} />
        </Tabs>
    )
}
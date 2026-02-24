import { router } from 'expo-router/build/exports';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SecondPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Page</Text>
            <Text style={styles.subtitle}>Welcome to the second page</Text>
            <Button title="Go to third page" onPress={() => { router.push("/thirdPage") }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
import { StyleSheet, Text, View } from 'react-native';

export default function ThirdPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Third Page</Text>
            <Text style={styles.subtitle}>Test Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
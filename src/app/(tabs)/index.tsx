import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <StatusBar style="auto" />
      <View style={{ gap: 20, marginTop: 20 }}>
        <Button title="Go to second page" onPress={() => { router.push("/secondPage") }} />
        <Button title="Go to third page" onPress={() => { router.push("/thirdPage") }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

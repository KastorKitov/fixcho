import { StyleSheet, Text, View, Button, Touchable, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>no jobs displayed</Text>
      <TouchableOpacity style={styles.plusButton} onPress={() => router.push('/(job)/addJob')}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
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
  plusButton:{
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.button,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowColor: Colors.button,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  plusButtonText: {
    fontSize: 38,
    color: Colors.buttonText,
    lineHeight: 32,
    fontWeight: "300",
  }
});

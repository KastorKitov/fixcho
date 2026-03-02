import { View, Text, StyleSheet } from "react-native";

const FormField = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <View style={{ width: "100%", marginBottom: 14 }}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={{ color: "#333" }}>*</Text>}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
inputLabel: {
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 6,
  color: "#333",
}
});

export default FormField;
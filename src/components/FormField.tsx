// Lab 9 — label + input + error message beneath it (reused by the Add form)
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function FormField({ label, error, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#999999"
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 14, color: COLORS.muted, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger, borderWidth: 2 },
  error: { color: COLORS.danger, fontSize: 13, marginTop: 4 },
});

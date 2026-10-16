// Lab 9 — Add tab: validated form; submit disabled until every field passes
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FormField from "../../components/FormField";
import { COLORS } from "../../constants/theme";
import { addEntry } from "../../services/priceStorage";

type Form = { produce: string; market: string; price: string; unit: string };
type Field = keyof Form;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Form = { produce: "", market: "", price: "", unit: "" };
const UNITS = ["heap", "bundle", "kg", "each", "bag"];

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.produce.trim() === "") e.produce = "Produce is required.";
  else if (f.produce.trim().length < 2)
    e.produce = "Produce must be at least 2 characters.";

  if (f.market.trim() === "") e.market = "Market is required.";
  else if (f.market.trim().length < 2)
    e.market = "Market must be at least 2 characters.";

  const price = Number(f.price);
  if (f.price.trim() === "") e.price = "Price is required.";
  else if (isNaN(price) || price <= 0)
    e.price = "Enter a price greater than zero, e.g. 5 or 2.50.";
  else if (price > 100000) e.price = "That price looks too high.";

  if (f.unit.trim() === "") e.unit = "Choose or type a unit.";
  return e;
}

export default function AddScreen() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [saving, setSaving] = useState(false);

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  function update(field: Field, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const errorFor = (field: Field) => (touched[field] ? errors[field] : undefined);

  async function handleSave() {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await addEntry({
        produce: form.produce.trim(),
        market: form.market.trim(),
        price: Number(form.price),
        unit: form.unit.trim(),
      });
      setForm(EMPTY);
      setTouched({});
      router.navigate("/"); // back to the Prices tab, which reloads on focus
    } catch {
      Alert.alert("Not saved", "Something went wrong saving this price. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Record a market price</Text>

        <FormField
          label="Produce"
          value={form.produce}
          onChangeText={(t) => update("produce", t)}
          onBlur={() => setTouched((p) => ({ ...p, produce: true }))}
          placeholder="e.g. Kaukau"
          autoCapitalize="words"
          error={errorFor("produce")}
        />

        <FormField
          label="Market"
          value={form.market}
          onChangeText={(t) => update("market", t)}
          onBlur={() => setTouched((p) => ({ ...p, market: true }))}
          placeholder="e.g. Lae Main Market"
          autoCapitalize="words"
          error={errorFor("market")}
        />

        <FormField
          label="Price (Kina)"
          value={form.price}
          onChangeText={(t) => update("price", t)}
          onBlur={() => setTouched((p) => ({ ...p, price: true }))}
          placeholder="e.g. 5.00"
          keyboardType="decimal-pad"
          error={errorFor("price")}
        />

        <FormField
          label="Unit"
          value={form.unit}
          onChangeText={(t) => update("unit", t)}
          onBlur={() => setTouched((p) => ({ ...p, unit: true }))}
          placeholder="e.g. heap"
          autoCapitalize="none"
          error={errorFor("unit")}
        />
        <View style={styles.chips}>
          {UNITS.map((u) => (
            <Pressable
              key={u}
              onPress={() => update("unit", u)}
              style={[styles.chip, form.unit === u && styles.chipSelected]}
            >
              <Text style={form.unit === u ? styles.chipTextSelected : styles.chipText}>
                {u}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submit,
            (!isValid || saving) && styles.submitDisabled,
            pressed && isValid && styles.submitPressed,
          ]}
          disabled={!isValid || saving}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitText}>Save price</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: 20, paddingBottom: 60 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: -6,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: COLORS.card,
  },
  chipSelected: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary },
  chipTextSelected: { color: "#ffffff" },
  submit: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
    minHeight: 50,
    justifyContent: "center",
  },
  submitDisabled: { opacity: 0.4 },
  submitPressed: { opacity: 0.7 },
  submitText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});

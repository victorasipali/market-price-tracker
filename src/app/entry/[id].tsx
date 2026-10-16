// Lab 9 — Detail screen: everything about one entry, with confirmed delete
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import {
  deleteEntry,
  formatDate,
  formatKina,
  getEntry,
  PriceEntry,
} from "../../services/priceStorage";

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<PriceEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getEntry(String(id))
      .then(setEntry)
      .catch(() => setEntry(null))
      .finally(() => setLoading(false));
  }, [id]);

  function confirmDelete() {
    if (!entry) return;
    Alert.alert(
      "Delete this price?",
      `${entry.produce} at ${entry.market} will be removed. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteEntry(entry.id);
              router.back();
            } catch {
              setDeleting(false);
              Alert.alert("Not deleted", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Guard clause — the id could be anything
  if (!entry) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={styles.notFound}>This price entry no longer exists.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const rows: [string, string][] = [
    ["Produce", entry.produce],
    ["Market", entry.market],
    ["Price", formatKina(entry.price)],
    ["Unit", entry.unit],
    ["Recorded", formatDate(entry.recordedAt)],
  ];

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: entry.produce }} />

      <View style={styles.hero}>
        <Text style={styles.heroPrice}>{formatKina(entry.price)}</Text>
        <Text style={styles.heroUnit}>per {entry.unit}</Text>
      </View>

      <View style={styles.card}>
        {rows.map(([label, value], i) => (
          <View
            key={label}
            style={[styles.fieldRow, i < rows.length - 1 && styles.fieldDivider]}
          >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.delete, deleting && styles.faded]}
        onPress={confirmDelete}
        disabled={deleting}
      >
        {deleting ? (
          <ActivityIndicator color={COLORS.danger} />
        ) : (
          <Text style={styles.deleteText}>Delete entry</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  hero: { alignItems: "center", marginVertical: 16 },
  heroPrice: { fontSize: 44, fontWeight: "bold", color: COLORS.primary },
  heroUnit: { fontSize: 16, color: COLORS.muted },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 16,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  fieldDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  label: { fontSize: 16, color: COLORS.muted },
  value: { fontSize: 16, fontWeight: "600", color: COLORS.text, flexShrink: 1, textAlign: "right" },
  delete: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: { color: COLORS.danger, fontSize: 16, fontWeight: "600" },
  faded: { opacity: 0.5 },
  notFound: { fontSize: 17, color: COLORS.danger, marginBottom: 16 },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  backText: { color: "#ffffff", fontWeight: "600" },
});

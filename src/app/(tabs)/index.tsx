// Lab 9 — Prices tab: searchable list with loading, error and two empty states.
// Reloads whenever the tab gains focus, so new entries from Add appear.
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EntryRow from "../../components/EntryRow";
import { COLORS } from "../../constants/theme";
import { getEntries, PriceEntry } from "../../services/priceStorage";

export default function PricesScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setEntries(await getEntries());
    } catch {
      setError("Could not read saved prices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const query = search.trim().toLowerCase();
  const filtered = entries.filter(
    (e) =>
      e.produce.toLowerCase().includes(query) ||
      e.market.toLowerCase().includes(query)
  );

  const emptyMessage =
    entries.length === 0
      ? "No prices recorded yet. Use the Add tab to record your first one."
      : `Nothing matches "${search.trim()}".`;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.muted}>Loading prices…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retry} onPress={load}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search produce or market"
        placeholderTextColor="#999999"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryRow
            entry={item}
            onPress={() =>
              router.push({ pathname: "/entry/[id]", params: { id: item.id } })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          entries.length > 0 ? (
            <Text style={styles.count}>
              {filtered.length} of {entries.length} entries
            </Text>
          ) : null
        }
        ListEmptyComponent={<Text style={styles.empty}>{emptyMessage}</Text>}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  muted: { color: COLORS.muted, marginTop: 8 },
  search: {
    backgroundColor: COLORS.card,
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  count: {
    color: COLORS.muted,
    fontSize: 13,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  separator: { height: 1, backgroundColor: COLORS.divider },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 16,
    marginTop: 48,
    paddingHorizontal: 24,
  },
  errorText: { color: COLORS.danger, fontSize: 16, marginBottom: 16 },
  retry: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  retryText: { color: "#ffffff", fontWeight: "600" },
});

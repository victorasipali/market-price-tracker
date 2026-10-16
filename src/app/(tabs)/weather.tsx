// Lab 7 — Task 7.4: weather screen with all four states
// (loading, success, empty, error), three PNG towns, a 7-day FlatList,
// pull-to-refresh and the time of the last successful update.
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchWeather,
  formatDay,
  ForecastDay,
  Town,
  TOWNS,
} from "../../services/weather";

export default function WeatherScreen() {
  const [town, setTown] = useState<Town>(TOWNS[0]);
  const [current, setCurrent] = useState<number | null>(null);
  const [days, setDays] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const weather = await fetchWeather(town);
        setCurrent(weather.current);
        setDays(weather.days);
        setUpdatedAt(new Date());
      } catch {
        setError(
          "Could not load the weather. Check your connection and try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [town]
  );

  // Runs on mount and again whenever the selected town changes.
  // Never remove the dependency array — that creates an infinite request loop.
  useEffect(() => {
    load();
  }, [load]);

  const townPicker = (
    <View style={styles.townRow}>
      {TOWNS.map((t) => {
        const selected = t.name === town.name;
        return (
          <Pressable
            key={t.name}
            onPress={() => setTown(t)}
            style={[styles.townButton, selected && styles.townSelected]}
          >
            <Text
              style={selected ? styles.townTextSelected : styles.townText}
            >
              {t.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  // Loading state — a spinner, never a blank screen
  if (loading) {
    return (
      <View style={styles.screen}>
        {townPicker}
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1F3864" />
          <Text style={styles.muted}>Loading weather for {town.name}…</Text>
        </View>
      </View>
    );
  }

  // Error state — clear message and a working retry
  if (error) {
    return (
      <View style={styles.screen}>
        {townPicker}
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => load()}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Success state (with empty state handled by the list)
  return (
    <View style={styles.screen}>
      {townPicker}
      <FlatList
        data={days}
        keyExtractor={(d) => d.date}
        refreshing={refreshing}
        onRefresh={() => load(true)}
        ListHeaderComponent={
          <View style={styles.summary}>
            {updatedAt && (
              <Text style={styles.muted}>
                Updated{" "}
                {updatedAt.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
            <Text style={styles.townName}>{town.name}</Text>
            <Text style={styles.currentTemp}>
              {current !== null ? `${Math.round(current)} °C` : "--"}
            </Text>
            <Text style={styles.sectionTitle}>7-day forecast</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No forecast available.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.dayRow}>
            <Text style={styles.dayDate}>{formatDay(item.date)}</Text>
            <Text style={styles.dayTemps}>
              <Text style={styles.max}>{Math.round(item.max)}°</Text>
              {"  /  "}
              <Text style={styles.min}>{Math.round(item.min)}°</Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4f6fa" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  townRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  townButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1F3864",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  townSelected: { backgroundColor: "#1F3864" },
  townText: { color: "#1F3864", fontWeight: "600", fontSize: 13 },
  townTextSelected: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  summary: { alignItems: "center", paddingVertical: 20 },
  townName: { fontSize: 20, fontWeight: "600", marginTop: 6 },
  currentTemp: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#1F3864",
  },
  sectionTitle: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },
  muted: { color: "#777777", marginTop: 8 },
  separator: { height: 1, backgroundColor: "#e0e0e0" },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  dayDate: { fontSize: 16 },
  dayTemps: { fontSize: 16 },
  max: { fontWeight: "bold", color: "#c0392b" },
  min: { color: "#2E5C8A" },
  empty: { textAlign: "center", color: "#888888", marginTop: 24 },
  errorText: {
    color: "#c0392b",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retry: {
    backgroundColor: "#1F3864",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  retryText: { color: "#ffffff", fontWeight: "600" },
});

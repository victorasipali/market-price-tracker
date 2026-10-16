// Lab 9 — one row in the Prices list (typed props)
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { formatDate, formatKina, PriceEntry } from "../services/priceStorage";

type EntryRowProps = {
  entry: PriceEntry;
  onPress: () => void;
};

export default function EntryRow({ entry, onPress }: EntryRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.left}>
        <Text style={styles.produce}>{entry.produce}</Text>
        <Text style={styles.meta}>
          {entry.market} · {formatDate(entry.recordedAt)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{formatKina(entry.price)}</Text>
        <Text style={styles.unit}>per {entry.unit}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
  },
  rowPressed: { backgroundColor: "#e9eef5" },
  left: { flex: 1 },
  right: { alignItems: "flex-end" },
  produce: { fontSize: 17, fontWeight: "600", color: COLORS.primary },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  price: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  unit: { fontSize: 12, color: COLORS.muted },
});

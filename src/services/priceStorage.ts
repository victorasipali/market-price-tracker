// Lab 9 — ALL storage calls live here. Screens and components never
// touch AsyncStorage directly.
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PriceEntry = {
  id: string;
  produce: string;
  market: string;
  price: number; // Kina
  unit: string; // e.g. heap, bundle, kg
  recordedAt: string; // ISO date
};

export type NewPriceEntry = Omit<PriceEntry, "id" | "recordedAt">;

const KEY = "market-price-entries";

export async function getEntries(): Promise<PriceEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return []; // first launch
  try {
    return JSON.parse(raw) as PriceEntry[];
  } catch {
    return [];
  }
}

async function saveEntries(entries: PriceEntry[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
}

export async function addEntry(input: NewPriceEntry): Promise<PriceEntry> {
  const entries = await getEntries();
  const entry: PriceEntry = {
    ...input,
    id: Date.now().toString(),
    recordedAt: new Date().toISOString(),
  };
  await saveEntries([entry, ...entries]); // newest first
  return entry;
}

export async function getEntry(id: string): Promise<PriceEntry | null> {
  const entries = await getEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  await saveEntries(entries.filter((e) => e.id !== id));
}

export function formatKina(amount: number) {
  return `K${amount.toFixed(2)}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

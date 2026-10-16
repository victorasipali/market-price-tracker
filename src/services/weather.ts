// Lab 7 — Open-Meteo service (free, no API key). Network code lives here,
// not inside the screen.

export type Town = { name: string; lat: number; lon: number };

export const TOWNS: Town[] = [
  { name: "Lae", lat: -6.73, lon: 147.0 },
  { name: "Port Moresby", lat: -9.44, lon: 147.18 },
  { name: "Mount Hagen", lat: -5.86, lon: 144.23 },
];

export type ForecastDay = { date: string; max: number; min: number };

export type Weather = {
  current: number;
  days: ForecastDay[];
};

export function buildUrl(town: Town) {
  return (
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${town.lat}&longitude=${town.lon}` +
    "&current=temperature_2m" +
    "&daily=temperature_2m_max,temperature_2m_min" +
    "&forecast_days=7" +
    "&timezone=auto"
  );
}

export async function fetchWeather(town: Town): Promise<Weather> {
  const response = await fetch(buildUrl(town));
  if (!response.ok) {
    throw new Error(`Server error (${response.status})`);
  }
  const json = await response.json();

  const times: string[] = json?.daily?.time ?? [];
  const days: ForecastDay[] = times.map((date, i) => ({
    date,
    max: json.daily.temperature_2m_max[i],
    min: json.daily.temperature_2m_min[i],
  }));

  return { current: json?.current?.temperature_2m, days };
}

// "2026-10-15" -> "Thu 15 Oct". Parsed as a local date to avoid UTC shifts.
export function formatDay(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

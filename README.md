# Market Price Tracker

A React Native app for recording and comparing fresh-produce prices at Papua New Guinea markets. It works fully offline and includes a weather forecast for Lae, Port Moresby and Mount Hagen.

Built with **Expo SDK 57**, **Expo Router** and **TypeScript** for IS325 Mobile Application Development, Lab 9.

## Features

- **Record prices.** Each entry holds the produce, market, price in Kina and unit (heap, bundle, kg, and so on).
- **Validated form.** Every field is checked, and the Save button stays disabled until the entry is valid.
- **Searchable list.** Filter by produce or market, without case sensitivity. Different messages show for "no entries yet" and "no matches".
- **Detail screen.** Shows every field, with a confirmation step before deleting.
- **Works offline.** Entries are stored on the device with AsyncStorage.
- **Weather tab.** A 7-day forecast from Open-Meteo, with no API key needed. Pull down to refresh. When offline, it shows a clear error with a retry button.
- **Loading indicators.** Every loading, saving and deleting action shows one.

## Project structure

```
src/
  app/                    Screens (Expo Router: each file is a route)
    _layout.tsx           Root stack
    (tabs)/
      _layout.tsx         Bottom tabs: Prices, Add, Weather
      index.tsx           Prices list with search
      add.tsx             Add-price form
      weather.tsx         7-day forecast
    entry/[id].tsx        Entry detail and delete
  components/             Reusable UI (EntryRow, FormField)
  services/               Storage and network code; screens never touch AsyncStorage directly
  constants/theme.ts      Shared colours
```

## Getting started

Prerequisites: Node.js 20 or newer, and Expo Go on an Android phone.

```
git clone https://github.com/<your-username>/market-price-tracker.git
cd market-price-tracker
npm install
npx expo start
```

Scan the QR code with Expo Go. If your phone and PC are on different networks, run `npx expo start --tunnel`.

## Building the APK

```
npm install -g eas-cli
eas login
npx expo-doctor
eas build --platform android --profile preview
```

The `preview` profile in `eas.json` produces an installable `.apk`.

## Tech stack

| Area         | Library                                   |
| ------------ | ----------------------------------------- |
| Framework    | React Native 0.86, Expo SDK 57            |
| Navigation   | Expo Router (stack and tabs)              |
| Storage      | @react-native-async-storage/async-storage |
| Icons        | @expo/vector-icons (Ionicons)             |
| Weather data | [Open-Meteo](https://open-meteo.com)      |

## Author

Victor Asipali, Bachelor of Business in Information Technology, Year 3

// Lab 9 — three tabs: Prices, Add, Weather
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { COLORS } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#ffffff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Prices",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

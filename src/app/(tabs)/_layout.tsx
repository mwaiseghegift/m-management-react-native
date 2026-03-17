import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarLabel: "Ledger",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          tabBarLabel: "Debts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarLabel: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          tabBarLabel: "Bills",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

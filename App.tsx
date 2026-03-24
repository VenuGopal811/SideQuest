/**
 * SideQuest — App.tsx
 *
 * Root entry point for a pure React Native (Expo) app.
 * All UI uses RN primitives: View, Text, TouchableOpacity, ScrollView, etc.
 * No web-specific code (no div, no CSS classes, no browser APIs).
 *
 * ─── Adding more screens later ─────────────────────────────────
 * Install: npx expo install @react-navigation/native @react-navigation/stack
 * Then wrap HomeScreen with <NavigationContainer><Stack.Navigator>
 *
 * ─── Adding a Python / FastAPI backend later ───────────────────
 * 1. Create /backend at repo root (separate FastAPI project)
 * 2. Add src/config/api.ts with your server base URL
 * 3. Firebase stays for anonymous auth; FastAPI handles game logic,
 *    leaderboards, quest generation, etc. Call it with fetch() or axios.
 * ────────────────────────────────────────────────────────────────
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { LeaderboardScreen } from "./src/screens/LeaderboardScreen";
import { theme } from "./src/styles/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Tab.Screen name="Quests" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Rankings" component={LeaderboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

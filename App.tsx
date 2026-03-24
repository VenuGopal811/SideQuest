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
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  return <HomeScreen />;
}

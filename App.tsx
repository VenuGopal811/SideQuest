/**
 * SideQuest — App.tsx
 *
 * Root entry point for a pure React Native (Expo) app.
 * All UI uses RN primitives: View, Text, TouchableOpacity, ScrollView, etc.
 * No web-specific code (no div, no CSS classes, no browser APIs).
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { LeaderboardScreen } from "./src/screens/LeaderboardScreen";
import { PlayerProvider } from "./src/store/PlayerContext";
import { theme } from "./src/styles/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PlayerProvider>
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
          <Tab.Screen
            name="Quests"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚔️</Text>,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
            }}
          />
          <Tab.Screen
            name="Rankings"
            component={LeaderboardScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PlayerProvider>
  );
}

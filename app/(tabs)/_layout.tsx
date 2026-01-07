import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";

export default function TabLayout() {
  const { theme, toggleTheme } = useThemeMode();
  const palette = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",

        // header theme
        headerStyle: {
          backgroundColor: palette.background,
        },
        headerTintColor: palette.text,

        // tab theme
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.progressTrack,
        },

        tabBarButton: HapticTab,

        headerRightContainerStyle: {
          paddingRight: 15,
        },

        // theme toggle button
        headerRight: () => (
          <Pressable hitSlop={12} onPress={toggleTheme}>
            <MaterialIcons
              name={theme === "dark" ? "wb-sunny" : "nightlight"}
              size={26}
              color={palette.icon}
            />
          </Pressable>
        ),

        tabBarLabelStyle: {
          fontSize: 13,     // change size
          fontWeight: "bold", // make it bold
        },
      }}
    >
      {/* 1️⃣ HOME / TODAY */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />

      {/* 2️⃣ ALL TASKS */}
      <Tabs.Screen
        name="all"
        options={{
          title: "All Tasks",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="check-box" size={26} color={color} />
          ),
        }}
      />

      {/* 3️⃣ CATEGORIES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

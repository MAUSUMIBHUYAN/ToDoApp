import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { theme: mode } = useThemeMode();
  const theme = Colors[mode];

  const [vibrate, setVibrate] = useState(false);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem("SETTINGS");
      if (stored) {
        const obj = JSON.parse(stored);
        setVibrate(obj.vibrate ?? false);
        setNotification(obj.notification ?? false);
      }
    } catch (err) {
      console.log("Error loading settings:", err);
    }
  };

  const updateSettings = async (key: "vibrate" | "notification", value: boolean) => {
    try {
      const stored = await AsyncStorage.getItem("SETTINGS");
      const obj = stored ? JSON.parse(stored) : {};
      obj[key] = value;
      await AsyncStorage.setItem("SETTINGS", JSON.stringify(obj));
    } catch (err) {
      console.log("Error saving settings:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: "bold" }}>Vibrate on Reminder</Text>
        <Switch
          value={vibrate}
          onValueChange={(val) => {
            setVibrate(val);
            updateSettings("vibrate", val);
          }}
          trackColor={{ false: "#888", true: theme.tabIconSelected }}
          thumbColor={vibrate ? "#fff" : "#ccc"}
        />
      </View>

      <View style={styles.row}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: "bold" }}>Push Notification</Text>
        <Switch
          value={notification}
          onValueChange={(val) => {
            setNotification(val);
            updateSettings("notification", val);
          }}
          trackColor={{ false: "#888", true: theme.tabIconSelected }}
          thumbColor={notification ? "#fff" : "#ccc"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
});

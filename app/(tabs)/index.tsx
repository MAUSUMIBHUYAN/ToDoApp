import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";
import { useFocusEffect } from "@react-navigation/native";

type Task = {
  id: string;
  title: string;
  category: "Work" | "Study" | "Personal";
  priority: "Low" | "Medium" | "High";
  due: string;
  completed: boolean;
};

export default function TodayScreen() {
  const { theme: mode } = useThemeMode();
  const theme = Colors[mode];

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem("TASKS");
      if (stored) setTasks(JSON.parse(stored));
    } catch (err) {
      console.log("Error loading tasks:", err);
    }
  };

  const toggleTask = async (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    setTasks(updated);
    await AsyncStorage.setItem("TASKS", JSON.stringify(updated));
  };

  const today = new Date();

  const todaysTasks = tasks.filter((t) => {
    const due = new Date(t.due);
    const isOverdue = due < today;
    const isToday = due.toDateString() === today.toDateString();
    return !t.completed && (isOverdue || isToday);
  });

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return theme.tabIconSelected;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Today’s Focus</Text>

      {todaysTasks.length === 0 ? (
        <Text style={{ color: theme.text, opacity: 0.7 }}>
          🎉 Nothing today — enjoy your time!
        </Text>
      ) : (
        <FlatList
          data={todaysTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => toggleTask(item.id)}
              style={[
                styles.cardContainer,
                item.completed && { opacity: 0.6 },
              ]}
            >
              <View
                style={[
                  styles.priorityBorder,
                  {
                    borderLeftColor: getPriorityColor(item.priority),
                    backgroundColor: theme.progressTrack,
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardContent,
                    { backgroundColor: theme.progressTrack },
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      { color: theme.text },
                      item.completed && { textDecorationLine: "line-through" },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <View style={styles.bottomRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: theme.tabIconSelected + "20" },
                      ]}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {item.category}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: getPriorityColor(item.priority),
                        fontWeight: "700",
                      }}
                    >
                      {item.priority}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 12 },

  cardContainer: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
  },

  priorityBorder: {
    borderLeftWidth: 4,
    borderRadius: 18,
    overflow: "hidden",
  },

  cardContent: {
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

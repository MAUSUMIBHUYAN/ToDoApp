import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";

type Task = {
  id: string;
  title: string;
  category: "Work" | "Study" | "Personal";
  priority: "Low" | "Medium" | "High";
  due: string;
  completed: boolean;
};

export default function AllTasksScreen() {
  const router = useRouter();

  const { theme: mode } = useThemeMode();
  const theme = Colors[mode];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryFilter, setCategoryFilter] =
    useState<"All" | "Work" | "Study" | "Personal">("All");

  const [priorityFilter, setPriorityFilter] =
    useState<"All" | "Low" | "Medium" | "High">("All");

  const [sortBy, setSortBy] =
    useState<"Newest" | "Oldest" | "Priority">("Priority"); // Changed default to Priority

  useFocusEffect(
    React.useCallback(() => {
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

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await AsyncStorage.setItem("TASKS", JSON.stringify(updated));
  };

  // Format date to display only date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "#ef4444"; // red-500
      case "Medium":
        return "#f59e0b"; // amber-500
      case "Low":
        return "#10b981"; // emerald-500
      default:
        return theme.tabIconSelected;
    }
  };

  // Helper to get text color based on theme mode
  const getButtonTextColor = () => {
    return mode === "dark" ? "#1e0f3c" : "#f3e8ff";
  };

  // ---------- FILTER ----------
  const filtered = tasks
    .filter((t) =>
      categoryFilter === "All" ? true : t.category === categoryFilter
    )
    .filter((t) =>
      priorityFilter === "All" ? true : t.priority === priorityFilter
    );

  // ---------- SORT ----------
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest") {
      // First by date (newest first), then by priority
      const dateA = new Date(a.due).getTime();
      const dateB = new Date(b.due).getTime();
      if (dateB !== dateA) return dateB - dateA;
      
      // If same date, sort by priority (High > Medium > Low)
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    }

    if (sortBy === "Oldest") {
      // First by date (oldest first), then by priority
      const dateA = new Date(a.due).getTime();
      const dateB = new Date(b.due).getTime();
      if (dateA !== dateB) return dateA - dateB;
      
      // If same date, sort by priority (High > Medium > Low)
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    }

    if (sortBy === "Priority") {
      // First by date (earliest first)
      const dateA = new Date(a.due).getTime();
      const dateB = new Date(b.due).getTime();

      if (dateA !== dateB) return dateA - dateB;

      // If same date → High > Medium > Low
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    }


    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* FILTER BAR */}
      <View style={styles.row}>
        {["All", "Work", "Study", "Personal"].map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategoryFilter(c as any)}
            style={[
              styles.chip,
              {
                borderColor: theme.text,
                backgroundColor: categoryFilter === c ? theme.tabIconSelected : "transparent",
              },
            ]}
          >
            <Text
              style={{
                color:
                  categoryFilter === c ? getButtonTextColor() : theme.text,
                fontWeight: categoryFilter === c ? "600" : "400",
              }}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* PRIORITY FILTER */}
      <View style={styles.row}>
        {["All", "Low", "Medium", "High"].map((p) => (
          <Pressable
            key={p}
            onPress={() => setPriorityFilter(p as any)}
            style={[
              styles.chip,
              {
                borderColor: theme.text,
                backgroundColor: priorityFilter === p ? theme.tabIconSelected : "transparent",
              },
            ]}
          >
            <Text
              style={{
                color:
                  priorityFilter === p ? getButtonTextColor() : theme.text,
                fontWeight: priorityFilter === p ? "600" : "400",
              }}
            >
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* SORT */}
      <View style={styles.row}>
        {["Newest", "Oldest", "Priority"].map((s) => (
          <Pressable
            key={s}
            onPress={() => setSortBy(s as any)}
            style={[
              styles.sortButton,
              {
                borderColor: theme.text,
                backgroundColor: sortBy === s ? theme.tabIconSelected : "transparent",
              },
            ]}
          >
            <Text
              style={{
                color: sortBy === s ? getButtonTextColor() : theme.text,
                fontWeight: sortBy === s ? "600" : "400",
              }}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LIST */}
      {sorted.length === 0 ? (
        <Text style={{ color: theme.text, opacity: 0.7, textAlign: "center", marginTop: 20 }}>
          No tasks match your filters.
        </Text>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.cardContainer,
                item.completed && { opacity: 0.6 },
              ]}
            >
              {/* PRIORITY BORDER - OUTER EDGE */}
              <View
                style={[
                  styles.priorityBorder,
                  {
                    borderLeftColor: getPriorityColor(item.priority),
                    borderLeftWidth: 4,
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
                  {/* TOP ROW: Title and Date */}
                  <View style={styles.topRow}>
                    <Pressable
                      onPress={() => router.push(`/edit?id=${item.id}`)}
                      onLongPress={() => toggleTask(item.id)}
                      style={{ flex: 1 }}
                    >
                      <Text
                        style={[
                          styles.title,
                          { color: theme.text },
                          item.completed && {
                            textDecorationLine: "line-through",
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </Pressable>
                    
                    <Text style={[styles.dateText, { color: theme.text + "80" }]}>
                      {formatDate(item.due)}
                    </Text>
                  </View>

                  {/* BOTTOM ROW: Category and Buttons */}
                  <View style={styles.bottomRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: theme.tabIconSelected + "20" }]}>
                      <Text style={{ color: theme.text, fontSize: 12, fontWeight: "500" }}>
                        {item.category}
                      </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                      <Pressable
                        onPress={() => router.push(`/edit?id=${item.id}`)}
                        style={[styles.smallBtn, { backgroundColor: theme.tabIconSelected }]}
                      >
                        <Text style={[styles.buttonText, { color: getButtonTextColor(), fontWeight: "600" }]}>
                          Edit
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => deleteTask(item.id)}
                        style={[styles.smallBtn, { backgroundColor: "#ef4444" }]}
                      >
                        <Text style={[styles.buttonText, { color: "white", fontWeight: "600" }]}>
                          Del
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/add")}
        style={[styles.fab, { backgroundColor: theme.tabIconSelected }]}
      >
        <Text style={{ color: getButtonTextColor(), fontSize: 28, fontWeight: "600" }}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  cardContainer: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  priorityBorder: {
    borderRadius: 18,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
    paddingLeft: 12,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    flex: 1,
    marginRight: 12,
  },
  dateText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});
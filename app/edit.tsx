import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Task = {
  id: string;
  title: string;
  category: "Work" | "Study" | "Personal";
  priority: "Low" | "Medium" | "High";
  due: string;
  completed: boolean;
};

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme: mode } = useThemeMode();
  const theme = Colors[mode];

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const stored = await AsyncStorage.getItem("TASKS");
    const list: Task[] = stored ? JSON.parse(stored) : [];

    const found = list.find((t) => t.id === id);
    if (found) setTask(found);
  };

  const saveTask = async () => {
    if (!task) return;

    if (!task.title.trim()) {
      Alert.alert("Task needs a title!");
      return;
    }

    const stored = await AsyncStorage.getItem("TASKS");
    const list: Task[] = stored ? JSON.parse(stored) : [];

    const updated = list.map((t) => (t.id === task.id ? task : t));

    await AsyncStorage.setItem("TASKS", JSON.stringify(updated));

    router.back();
  };

  const deleteTask = async () => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const stored = await AsyncStorage.getItem("TASKS");
          const list: Task[] = stored ? JSON.parse(stored) : [];

          const updated = list.filter((t) => t.id !== id);

          await AsyncStorage.setItem("TASKS", JSON.stringify(updated));

          router.back();
        },
      },
    ]);
  };

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Edit Task
      </Text>

      {/* TITLE */}
      <TextInput
        value={task.title}
        onChangeText={(text) => setTask({ ...task, title: text })}
        placeholder="Task title"
        placeholderTextColor="#888"
        style={[styles.input, { color: theme.text }]}
      />

      {/* CATEGORY */}
      <Text style={[styles.label, { color: theme.text }]}>Category</Text>

      <View style={styles.row}>
        {["Work", "Study", "Personal"].map((c) => {
          const selected = task.category === c;

          return (
            <Pressable
              key={c}
              onPress={() => setTask({ ...task, category: c as any })}
              style={[
                styles.chip,
                selected && {
                  backgroundColor: theme.tabIconSelected,
                  borderColor: "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: selected ? theme.selectedText : theme.text,
                  fontWeight: selected ? "800" : "500",
                }}
              >
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* PRIORITY */}
      <Text style={[styles.label, { color: theme.text }]}>Priority</Text>

      <View style={styles.row}>
        {["Low", "Medium", "High"].map((p) => {
          const selected = task.priority === p;

          return (
            <Pressable
              key={p}
              onPress={() => setTask({ ...task, priority: p as any })}
              style={[
                styles.chip,
                selected && {
                  backgroundColor: theme.tabIconSelected,
                  borderColor: "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: selected ? theme.selectedText : theme.text,
                  fontWeight: selected ? "800" : "500",
                }}
              >
                {p}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* DUE DATE */}
      <Text style={[styles.label, { color: theme.text }]}>Due Date</Text>

      <TextInput
        value={task.due}
        onChangeText={(text) => setTask({ ...task, due: text })}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
        style={[styles.input, { color: theme.text }]}
      />

      {/* SAVE */}
      <Pressable onPress={saveTask} style={styles.button}>
        <Text style={{ color: "white", fontWeight: "700" }}>Save</Text>
      </Pressable>

      {/* DELETE */}
      <Pressable onPress={deleteTask} style={styles.deleteButton}>
        <Text style={{ color: "white", fontWeight: "700" }}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 8, marginTop: 30},
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    padding: 10,
  },
  label: { marginTop: 6, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, marginVertical: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#555",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});

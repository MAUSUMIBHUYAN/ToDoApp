import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/theme-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function AddTaskScreen() {
  const router = useRouter();
  const { theme: mode } = useThemeMode();
  const theme = Colors[mode];

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<"Work" | "Study" | "Personal">("Work");
  const [priority, setPriority] =
    useState<"Low" | "Medium" | "High">("Low");
  const [due, setDue] = useState("");

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert("Task needs a title!");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      priority,
      due: due || new Date().toISOString(),
      completed: false,
    };

    try {
      const stored = await AsyncStorage.getItem("TASKS");
      const list: Task[] = stored ? JSON.parse(stored) : [];
      const updated = [...list, newTask];

      await AsyncStorage.setItem("TASKS", JSON.stringify(updated));
      router.back();
    } catch (err) {
      console.log("Error saving:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Add Task
      </Text>

      <TextInput
        placeholder="Task title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { color: theme.text }]}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        Category
      </Text>

      <View style={styles.row}>
        {["Work", "Study", "Personal"].map((c) => {
          const selected = category === c;

          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c as any)}
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

      <Text style={[styles.label, { color: theme.text }]}>
        Priority
      </Text>

      <View style={styles.row}>
        {["Low", "Medium", "High"].map((p) => {
          const selected = priority === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPriority(p as any)}
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

      <Text style={[styles.label, { color: theme.text }]}>
        Due Date
      </Text>

      <TextInput
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
        value={due}
        onChangeText={setDue}
        style={[styles.input, { color: theme.text }]}
      />

      <Pressable onPress={saveTask} style={styles.button}>
        <Text style={{ color: "white", fontWeight: "700" }}>Save</Text>
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
});

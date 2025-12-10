import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

type Achievement = {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
};

const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Sip!",
    description: "Logged your first drink of water.",
    achieved: true,
  },
  {
    id: "2",
    title: "Halfway There",
    description: "Reached 50% of your daily water goal.",
    achieved: false,
  },
  {
    id: "3",
    title: "Hydration Master",
    description: "Completed your daily goal.",
    achieved: false,
  },
  {
    id: "4",
    title: "Consistency King",
    description: "Completed your goal for 7 days straight.",
    achieved: false,
  },
];

export default function AchievementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.achieved && styles.completedCard]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            {item.achieved && <Text style={styles.badge}>✓ Completed</Text>}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  completedCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 10,
  },
  badge: {
    marginTop: 5,
    color: "#4CAF50",
    fontWeight: "700",
  },
});

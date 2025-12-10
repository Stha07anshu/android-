import React, { useState } from "react";
import { reloadAsync as reloadAppAsync } from "expo-updates";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch (restartError) {
      console.error("Failed to restart app:", restartError);
      resetError();
    }
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) details += `Stack Trace:\n${error.stack}`;
    return details;
  };

  return (
    <ThemedView style={styles.container}>
      {__DEV__ && (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={({ pressed }) => [
            styles.topButton,
            { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="alert-circle" size={20} color={colors.text} />
        </Pressable>
      )}

      <View style={styles.content}>
        <ThemedText style={styles.title}>Something went wrong</ThemedText>
        <ThemedText style={[styles.message, { color: colors.textSecondary }]}>
          Please reload the app to continue.
        </ThemedText>

        <Pressable
          onPress={handleRestart}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Try Again
          </ThemedText>
        </Pressable>
      </View>

      {__DEV__ && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Error Details</ThemedText>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  style={({ pressed }) => [{ padding: Spacing.xs, opacity: pressed ? 0.6 : 1 }]}
                >
                  <Feather name="x" size={24} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScrollView}>
                <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.errorText, { color: colors.text, fontFamily: "monospace" }]} selectable>
                    {formatErrorDetails()}
                  </Text>
                </View>
              </ScrollView>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: Spacing["2xl"] },
  content: { alignItems: "center", gap: Spacing.lg, width: "100%", maxWidth: 600 },
  title: { textAlign: "center", fontSize: 24, fontWeight: "700", lineHeight: 32 },
  message: { textAlign: "center", opacity: 0.7, lineHeight: 24 },
  topButton: { position: "absolute", top: Spacing["2xl"], right: Spacing.lg, width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: "center", alignItems: "center", zIndex: 10 },
  button: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing["2xl"], borderRadius: BorderRadius.md, minWidth: 200, alignItems: "center" },
  buttonText: { fontWeight: "600", fontSize: 16, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContainer: { width: "100%", height: "90%", borderTopLeftRadius: BorderRadius.lg, borderTopRightRadius: BorderRadius.lg },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: "rgba(128,128,128,0.2)" },
  modalTitle: { fontWeight: "600", fontSize: 18 },
  modalScrollView: { flex: 1 },
  errorContainer: { width: "100%", borderRadius: BorderRadius.md, padding: Spacing.lg },
  errorText: { fontSize: 12, lineHeight: 18 },
});

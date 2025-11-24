import { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { CircularProgress } from '@/components/CircularProgress';
import { WaterLogCard } from '@/components/WaterLogCard';
import { useWaterTracking } from '@/hooks/useWaterTracking';
import { useTheme } from '@/hooks/useTheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Spacing, BorderRadius } from '@/constants/theme';

const QUICK_ADD_AMOUNTS = [250, 500, 750, 1000];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { todayIntake, dailyGoal, addWater, removeWater, getTodayLogs } = useWaterTracking();
  const [modalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const todayLogs = getTodayLogs();
  const progress = todayIntake / dailyGoal;

  const handleQuickAdd = async (amount: number) => {
    await addWater(amount);
  };

  const handleCustomAdd = async () => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    await addWater(amount);
    setCustomAmount('');
    setModalVisible(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressSection}>
          <CircularProgress
            progress={progress}
            current={todayIntake}
            goal={dailyGoal}
          />
          {progress >= 1 ? (
            <ThemedText style={[styles.goalMessage, { color: colors.success }]}>
              Daily goal achieved!
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.quickAddSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Add
          </ThemedText>
          <View style={styles.quickAddGrid}>
            {QUICK_ADD_AMOUNTS.map((amount) => (
              <Pressable
                key={amount}
                style={({ pressed }) => [
                  styles.quickAddButton,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={() => handleQuickAdd(amount)}
              >
                <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
                <ThemedText style={[styles.quickAddText, { color: colors.text }]}>
                  {amount} ml
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.logsSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Log
          </ThemedText>
          {todayLogs.length === 0 ? (
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No water logged yet today. Start hydrating!
            </ThemedText>
          ) : (
            <View style={styles.logsList}>
              {todayLogs.slice().reverse().map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <WaterLogCard
                    amount={log.amount}
                    time={formatTime(log.timestamp)}
                    onDelete={() => removeWater(log.id)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScreenScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { 
            backgroundColor: colors.primary,
            bottom: tabBarHeight + Spacing.xl,
            opacity: pressed ? 0.9 : 1,
            shadowColor: colors.text,
          }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus-circle" size={28} color="#FFFFFF" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable 
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Add Custom Amount
            </ThemedText>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Enter amount in ml"
              placeholderTextColor={colors.textSecondary}
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.addButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={handleCustomAdd}
              >
                <ThemedText style={styles.addButtonText}>Add</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: 100,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  goalMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  quickAddSection: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    gap: Spacing.sm,
    minWidth: 120,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logsSection: {
    marginBottom: Spacing['2xl'],
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  logsList: {
    gap: Spacing.md,
  },
  logItem: {},
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {},
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

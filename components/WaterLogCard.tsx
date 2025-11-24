import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';

interface WaterLogCardProps {
  amount: number;
  time: string;
  onDelete: () => void;
}

export function WaterLogCard({ amount, time, onDelete }: WaterLogCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="water" size={24} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.amount, { color: colors.text }]}>
          {amount} ml
        </ThemedText>
        <ThemedText style={[styles.time, { color: colors.textSecondary }]}>
          {time}
        </ThemedText>
      </View>
      <Pressable 
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.5 : 1 }
        ]}
      >
        <MaterialCommunityIcons name="delete-outline" size={20} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  icon: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
});

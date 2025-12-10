import React from 'react';
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

export const WaterLogCard: React.FC<WaterLogCardProps> = ({ amount, time, onDelete }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="water" size={24} color={colors.primary} />
        <View style={styles.info}>
          <ThemedText style={[styles.amount, { color: colors.text }]}>{amount} ml</ThemedText>
          <ThemedText style={[styles.time, { color: colors.textSecondary }]}>{time}</ThemedText>
        </View>
      </View>
      <Pressable onPress={onDelete} hitSlop={8}>
        <MaterialCommunityIcons name="close-circle" size={24} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  info: {
    marginLeft: Spacing.sm,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    opacity: 0.7,
  },
});

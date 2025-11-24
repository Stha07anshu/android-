import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useWaterTracking } from '../hooks/useWaterTracking';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';

export function HistoryScreen() {
  const { colors } = useTheme();
  const { getHistoricalData, dailyGoal } = useWaterTracking();
  
  const historicalData = getHistoricalData();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getPercentage = (total: number) => {
    return Math.round((total / dailyGoal) * 100);
  };

  const calculateStats = () => {
    if (historicalData.length === 0) {
      return { average: 0, bestDay: 0, currentStreak: 0 };
    }

    const total = historicalData.reduce((sum, day) => sum + day.total, 0);
    const average = Math.round(total / historicalData.length);
    const bestDay = Math.max(...historicalData.map(d => d.total));

    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayData = historicalData.find(d => d.date === dateStr);
      
      if (dayData && dayData.total >= dailyGoal) {
        currentStreak++;
      } else {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { average, bestDay, currentStreak };
  };

  const stats = calculateStats();

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <View style={styles.statsSection}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {stats.average} ml
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Daily Average
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="trophy" size={24} color={colors.success} />
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {stats.bestDay} ml
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Best Day
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="fire" size={24} color={colors.secondary} />
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {stats.currentStreak}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </ThemedText>
        </View>
      </View>

      <View style={styles.historySection}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          History
        </ThemedText>
        {historicalData.length === 0 ? (
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            No history yet. Start tracking your water intake!
          </ThemedText>
        ) : (
          <View style={styles.historyList}>
            {historicalData.map((day) => {
              const percentage = getPercentage(day.total);
              const isGoalMet = day.total >= dailyGoal;
              
              return (
                <View 
                  key={day.date} 
                  style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyDateContainer}>
                      <ThemedText style={[styles.historyDate, { color: colors.text }]}>
                        {formatDate(day.date)}
                      </ThemedText>
                      {isGoalMet ? (
                        <MaterialCommunityIcons 
                          name="check-circle" 
                          size={18} 
                          color={colors.success} 
                        />
                      ) : null}
                    </View>
                    <ThemedText style={[styles.historyAmount, { color: colors.text }]}>
                      {day.total} ml
                    </ThemedText>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          backgroundColor: isGoalMet ? colors.success : colors.primary,
                          width: `${Math.min(percentage, 100)}%`
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={[styles.percentageText, { color: colors.textSecondary }]}>
                    {percentage}% of daily goal
                  </ThemedText>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  statsSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  historySection: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  historyList: {
    gap: Spacing.md,
  },
  historyCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
  },
  percentageText: {
    fontSize: 12,
  },
});

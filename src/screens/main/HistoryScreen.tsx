import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { ThemedText } from '../../components/ThemedText';
import { ScreenScrollView } from '../../components/ScreenScrollView';
import { useWaterTracking } from '../../hooks/useWaterTracking';
import { useTheme } from '../../hooks/useTheme';
import { Spacing, BorderRadius } from '../../constants/theme';
import React, { useState, useMemo, useEffect } from 'react';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export function HistoryScreen() {
  const { colors } = useTheme();
  const { getHistoricalData, dailyGoal } = useWaterTracking();
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    getHistoricalData().then(data => setHistoricalData(data));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getPercentage = (total: number) => {
    if (dailyGoal <= 0) return 0;
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

  const getWeeklyData = () => {
    const weeks: { label: string; total: number; average: number }[] = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      let weekTotal = 0;
      let daysWithData = 0;
      
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayData = historicalData.find(day => day.date === dateStr);
        if (dayData) {
          weekTotal += dayData.total;
          daysWithData++;
        }
      }
      
      const weekAverage = daysWithData > 0 ? Math.round(weekTotal / 7) : 0;
      const weekLabel = i === 0 ? 'This Week' : `${i} Week${i > 1 ? 's' : ''} Ago`;
      
      weeks.unshift({ label: weekLabel, total: weekTotal, average: weekAverage });
    }
    
    return weeks;
  };

  const getMonthlyData = () => {
    const months: { label: string; total: number; average: number }[] = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      let monthTotal = 0;
      let daysInMonth = monthEnd.getDate();
      
      for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayData = historicalData.find(day => day.date === dateStr);
        if (dayData) {
          monthTotal += dayData.total;
        }
      }
      
      const monthAverage = Math.round(monthTotal / daysInMonth);
      const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: i > 0 ? '2-digit' : undefined });
      
      months.unshift({ label: monthLabel, total: monthTotal, average: monthAverage });
    }
    
    return months;
  };

  const weeklyData = useMemo(() => getWeeklyData(), [historicalData]);
  const monthlyData = useMemo(() => getMonthlyData(), [historicalData]);

  const renderBarChart = (data: { label: string; average: number }[]) => {
    if (dailyGoal <= 0) {
      return (
        <View style={styles.chartContainer}>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Set a daily goal in your profile to see chart visualizations
          </ThemedText>
        </View>
      );
    }

    const chartHeight = 180;
    const chartWidth = 320;
    const barWidth = (chartWidth - 40) / data.length;
    const maxValue = Math.max(...data.map(d => d.average), dailyGoal, 1);
    const scale = (chartHeight - 40) / maxValue;
    const goalLineY = chartHeight - 20 - (dailyGoal * scale);

    return (
      <View style={styles.chartContainer}>
        <Svg height={chartHeight} width={chartWidth}>
          <Line
            x1="20"
            y1={goalLineY}
            x2={chartWidth - 20}
            y2={goalLineY}
            stroke={colors.success}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <SvgText
            x="24"
            y={goalLineY - 4}
            fill={colors.success}
            fontSize="10"
            fontWeight="600"
          >
            Goal
          </SvgText>
          
          {data.map((item, index) => {
            const barHeight = item.average * scale;
            const x = 20 + (index * barWidth) + (barWidth / 4);
            const y = chartHeight - 20 - barHeight;
            const isGoalMet = item.average >= dailyGoal;
            
            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth / 2}
                  height={barHeight}
                  fill={isGoalMet ? colors.success : colors.primary}
                  rx="3"
                />
                <SvgText
                  x={x + barWidth / 4}
                  y={chartHeight - 4}
                  fill={colors.textSecondary}
                  fontSize="10"
                  textAnchor="middle"
                >
                  {item.label.length > 8 ? item.label.substring(0, 8) : item.label}
                </SvgText>
                <SvgText
                  x={x + barWidth / 4}
                  y={y - 4}
                  fill={colors.text}
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {item.average}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    );
  };

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewModeToggle}>
        {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
          <Pressable
            key={mode}
            style={({ pressed }) => [
              styles.viewModeButton,
              viewMode === mode && { backgroundColor: colors.primary },
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setViewMode(mode)}
          >
            <ThemedText
              style={[
                styles.viewModeText,
                { color: viewMode === mode ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </View>
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

      {viewMode === 'weekly' ? (
        <View style={styles.chartSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Weekly Average Intake
          </ThemedText>
          {renderBarChart(weeklyData)}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.primary }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                Below Goal
              </ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.success }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                Goal Met
              </ThemedText>
            </View>
          </View>
        </View>
      ) : viewMode === 'monthly' ? (
        <View style={styles.chartSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Monthly Average Intake
          </ThemedText>
          {renderBarChart(monthlyData)}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.primary }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                Below Goal
              </ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.success }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                Goal Met
              </ThemedText>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.historySection}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          {viewMode === 'daily' ? 'History' : 'Detailed Statistics'}
        </ThemedText>
        {viewMode === 'daily' && historicalData.length === 0 ? (
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            No history yet. Start tracking your water intake!
          </ThemedText>
        ) : null}
        
        {viewMode === 'daily' && historicalData.length > 0 ? (
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
                          width: dailyGoal > 0 ? `${Math.min(percentage, 100)}%` : '0%'
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
        ) : null}
        
        {viewMode === 'weekly' ? (
          <View style={styles.historyList}>
            {weeklyData.map((week, index) => (
              <View 
                key={index} 
                style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.historyHeader}>
                  <ThemedText style={[styles.historyDate, { color: colors.text }]}>
                    {week.label}
                  </ThemedText>
                  <ThemedText style={[styles.historyAmount, { color: colors.text }]}>
                    {week.average} ml avg
                  </ThemedText>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: dailyGoal > 0 && week.average >= dailyGoal ? colors.success : colors.primary,
                        width: dailyGoal > 0 ? `${Math.min((week.average / dailyGoal) * 100, 100)}%` : '0%'
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={[styles.percentageText, { color: colors.textSecondary }]}>
                  Total: {week.total} ml
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
        
        {viewMode === 'monthly' ? (
          <View style={styles.historyList}>
            {monthlyData.map((month, index) => (
              <View 
                key={index} 
                style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.historyHeader}>
                  <ThemedText style={[styles.historyDate, { color: colors.text }]}>
                    {month.label}
                  </ThemedText>
                  <ThemedText style={[styles.historyAmount, { color: colors.text }]}>
                    {month.average} ml avg
                  </ThemedText>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: dailyGoal > 0 && month.average >= dailyGoal ? colors.success : colors.primary,
                        width: dailyGoal > 0 ? `${Math.min((month.average / dailyGoal) * 100, 100)}%` : '0%'
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={[styles.percentageText, { color: colors.textSecondary }]}>
                  Total: {month.total} ml
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  viewModeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartSection: {
    marginBottom: Spacing['2xl'],
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
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
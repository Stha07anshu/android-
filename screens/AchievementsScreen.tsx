import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Card } from '../components/Card';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { useWaterTracking } from '../hooks/useWaterTracking';
import { Achievement, AchievementService } from '../utils/achievements';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export function AchievementsScreen() {
  const { colors } = useTheme();
  const { stats } = useWaterTracking();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, [stats]);

  const loadAchievements = async () => {
    const unlocked = await AchievementService.getUnlockedAchievements();
    const locked = await AchievementService.getLockedAchievements();
    setUnlockedAchievements(unlocked);
    setLockedAchievements(locked);
  };

  const getProgressForAchievement = (achievement: Achievement): number => {
    if (!stats) return 0;

    let current = 0;
    switch (achievement.category) {
      case 'streak':
        current = Math.max(stats.currentStreak, stats.bestStreak);
        break;
      case 'consumption':
        current = stats.totalWaterConsumed;
        break;
      case 'consistency':
        current = stats.totalDaysMetGoal;
        break;
    }

    return Math.min((current / achievement.requirement) * 100, 100);
  };

  const formatRequirement = (achievement: Achievement): string => {
    switch (achievement.category) {
      case 'streak':
        return `${achievement.requirement} day${achievement.requirement > 1 ? 's' : ''}`;
      case 'consumption':
        return `${(achievement.requirement / 1000).toFixed(0)}L`;
      case 'consistency':
        return `${achievement.requirement} day${achievement.requirement > 1 ? 's' : ''}`;
      default:
        return '';
    }
  };

  const renderAchievement = (achievement: Achievement, isUnlocked: boolean) => {
    const progress = getProgressForAchievement(achievement);
    
    return (
      <Card 
        key={achievement.id} 
        style={[
          styles.achievementCard,
          !isUnlocked && { opacity: 0.5 }
        ]}
      >
        <View style={styles.achievementHeader}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: isUnlocked ? colors.primary : colors.surface }
          ]}>
            <Feather 
              name={achievement.icon as any} 
              size={24} 
              color={isUnlocked ? '#fff' : colors.textSecondary} 
            />
          </View>
          <View style={styles.achievementInfo}>
            <ThemedText style={styles.achievementTitle}>
              {achievement.title}
            </ThemedText>
            <ThemedText style={styles.achievementDescription} lightColor="#666" darkColor="#999">
              {achievement.description}
            </ThemedText>
            <ThemedText style={styles.achievementRequirement} lightColor="#888" darkColor="#777">
              {formatRequirement(achievement)}
            </ThemedText>
          </View>
          {isUnlocked && (
            <Feather name="check-circle" size={24} color={colors.primary} />
          )}
        </View>
        {!isUnlocked && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText} lightColor="#666" darkColor="#999">
              {progress.toFixed(0)}%
            </ThemedText>
          </View>
        )}
      </Card>
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <ThemedText style={styles.statsTitle}>Your Progress</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Feather name="zap" size={24} color={colors.primary} />
                <ThemedText style={styles.statValue}>{stats?.currentStreak || 0}</ThemedText>
                <ThemedText style={styles.statLabel} lightColor="#666" darkColor="#999">
                  Current Streak
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Feather name="award" size={24} color={colors.primary} />
                <ThemedText style={styles.statValue}>{stats?.bestStreak || 0}</ThemedText>
                <ThemedText style={styles.statLabel} lightColor="#666" darkColor="#999">
                  Best Streak
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Feather name="droplet" size={24} color={colors.primary} />
                <ThemedText style={styles.statValue}>
                  {((stats?.totalWaterConsumed || 0) / 1000).toFixed(1)}L
                </ThemedText>
                <ThemedText style={styles.statLabel} lightColor="#666" darkColor="#999">
                  Total Water
                </ThemedText>
              </View>
            </View>
          </Card>
        </View>

        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Unlocked ({unlockedAchievements.length})
            </ThemedText>
            {unlockedAchievements.map(achievement => 
              renderAchievement(achievement, true)
            )}
          </View>
        )}

        {lockedAchievements.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Locked ({lockedAchievements.length})
            </ThemedText>
            {lockedAchievements.map(achievement => 
              renderAchievement(achievement, false)
            )}
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  statsContainer: {
    marginBottom: Spacing.lg,
  },
  statsCard: {
    padding: Spacing.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  achievementCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    gap: Spacing.xxs,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
  },
  achievementRequirement: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: 14,
    minWidth: 40,
    textAlign: 'right',
  },
});

import { StorageService, UnlockedAchievement, UserStats } from './storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'consumption' | 'consistency';
  requirement: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Reach a 3-day streak',
    icon: 'droplet',
    category: 'streak',
    requirement: 3,
  },
  {
    id: 'streak_7',
    title: 'One Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'award',
    category: 'streak',
    requirement: 7,
  },
  {
    id: 'streak_14',
    title: 'Two Week Champion',
    description: 'Keep going for 14 days',
    icon: 'star',
    category: 'streak',
    requirement: 14,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Hit a 30-day streak',
    icon: 'trending-up',
    category: 'streak',
    requirement: 30,
  },
  {
    id: 'streak_60',
    title: 'Hydration Hero',
    description: 'Achieve a 60-day streak',
    icon: 'zap',
    category: 'streak',
    requirement: 60,
  },
  {
    id: 'streak_90',
    title: 'Aqua Legend',
    description: 'Complete a 90-day streak',
    icon: 'shield',
    category: 'streak',
    requirement: 90,
  },
  {
    id: 'total_50L',
    title: 'First 50 Liters',
    description: 'Drink 50 liters total',
    icon: 'droplet',
    category: 'consumption',
    requirement: 50000,
  },
  {
    id: 'total_100L',
    title: 'Century Club',
    description: 'Drink 100 liters total',
    icon: 'activity',
    category: 'consumption',
    requirement: 100000,
  },
  {
    id: 'total_500L',
    title: 'Half Ton',
    description: 'Drink 500 liters total',
    icon: 'award',
    category: 'consumption',
    requirement: 500000,
  },
  {
    id: 'total_1000L',
    title: 'One Ton Wonder',
    description: 'Drink 1000 liters total',
    icon: 'star',
    category: 'consumption',
    requirement: 1000000,
  },
  {
    id: 'consistency_7',
    title: 'Weekly Warrior',
    description: 'Meet your goal 7 times',
    icon: 'check-circle',
    category: 'consistency',
    requirement: 7,
  },
  {
    id: 'consistency_30',
    title: 'Monthly Achiever',
    description: 'Meet your goal 30 times',
    icon: 'target',
    category: 'consistency',
    requirement: 30,
  },
  {
    id: 'consistency_100',
    title: 'Century Achiever',
    description: 'Meet your goal 100 times',
    icon: 'award',
    category: 'consistency',
    requirement: 100,
  },
  {
    id: 'consistency_365',
    title: 'Year of Hydration',
    description: 'Meet your goal 365 times',
    icon: 'shield',
    category: 'consistency',
    requirement: 365,
  },
];

export class AchievementService {
  static async checkAndUnlockAchievements(stats: UserStats): Promise<string[]> {
    const unlockedAchievements = await StorageService.getAchievements();
    const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
    const newlyUnlocked: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id)) {
        continue;
      }

      let shouldUnlock = false;

      switch (achievement.category) {
        case 'streak':
          shouldUnlock = stats.currentStreak >= achievement.requirement || stats.bestStreak >= achievement.requirement;
          break;
        case 'consumption':
          shouldUnlock = stats.totalWaterConsumed >= achievement.requirement;
          break;
        case 'consistency':
          shouldUnlock = stats.totalDaysMetGoal >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        const newAchievement: UnlockedAchievement = {
          id: achievement.id,
          unlockedAt: Date.now(),
        };
        unlockedAchievements.push(newAchievement);
        newlyUnlocked.push(achievement.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      await StorageService.saveAchievements(unlockedAchievements);
    }

    return newlyUnlocked;
  }

  static async getUnlockedAchievements(): Promise<Achievement[]> {
    const unlocked = await StorageService.getAchievements();
    const unlockedIds = new Set(unlocked.map(a => a.id));
    return ACHIEVEMENTS.filter(a => unlockedIds.has(a.id));
  }

  static async getLockedAchievements(): Promise<Achievement[]> {
    const unlocked = await StorageService.getAchievements();
    const unlockedIds = new Set(unlocked.map(a => a.id));
    return ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id));
  }

  static getNextAchievement(category: Achievement['category'], stats: UserStats): Achievement | null {
    const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category).sort((a, b) => a.requirement - b.requirement);
    
    let currentValue = 0;
    switch (category) {
      case 'streak':
        currentValue = Math.max(stats.currentStreak, stats.bestStreak);
        break;
      case 'consumption':
        currentValue = stats.totalWaterConsumed;
        break;
      case 'consistency':
        currentValue = stats.totalDaysMetGoal;
        break;
    }

    for (const achievement of categoryAchievements) {
      if (currentValue < achievement.requirement) {
        return achievement;
      }
    }

    return null;
  }
}

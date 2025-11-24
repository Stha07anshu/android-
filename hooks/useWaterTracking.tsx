import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { StorageService, WaterLog, UserStats } from '../utils/storage';
import { useAuth } from './useAuth';
import { AchievementService, ACHIEVEMENTS } from '../utils/achievements';

interface WaterTrackingContextType {
  logs: WaterLog[];
  dailyGoal: number;
  todayIntake: number;
  stats: UserStats | null;
  addWater: (amount: number) => Promise<void>;
  removeWater: (id: string) => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  getTodayLogs: () => WaterLog[];
  getHistoricalData: () => { date: string; total: number }[];
  refreshStats: () => Promise<void>;
}

const WaterTrackingContext = createContext<WaterTrackingContextType | undefined>(undefined);

export function WaterTrackingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [dailyGoal, setDailyGoalState] = useState(2000);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (user && logs.length > 0) {
      updateStats();
    }
  }, [logs, dailyGoal]);

  const loadData = async () => {
    try {
      const [savedLogs, savedGoal, savedStats] = await Promise.all([
        StorageService.getWaterLogs(),
        StorageService.getDailyGoal(),
        StorageService.getStats(),
      ]);
      setLogs(savedLogs);
      setDailyGoalState(savedGoal);
      setStats(savedStats);
    } catch (error) {
      console.error('Failed to load water tracking data:', error);
    }
  };

  const calculateStats = (): UserStats => {
    const dataByDate: { [key: string]: number } = {};
    
    logs.forEach(log => {
      if (dataByDate[log.date]) {
        dataByDate[log.date] += log.amount;
      } else {
        dataByDate[log.date] = log.amount;
      }
    });

    const sortedDates = Object.keys(dataByDate).sort((a, b) => a.localeCompare(b));
    const totalWaterConsumed = logs.reduce((sum, log) => sum + log.amount, 0);
    
    let currentStreak = 0;
    let bestStreak = 0;
    let totalDaysMetGoal = 0;
    let tempStreak = 0;
    let streakAtLastGoalDate = 0;
    let lastGoalMetDate: string | null = null;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = getDateBefore(today);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const dateTotal = dataByDate[date];
      
      if (dateTotal >= dailyGoal) {
        totalDaysMetGoal++;
        lastGoalMetDate = date;
        
        const isConsecutive = i === 0 || getDateAfter(sortedDates[i - 1]) === date;
        const prevDayMetGoal = i === 0 || dataByDate[sortedDates[i - 1]] >= dailyGoal;
        
        if (isConsecutive && prevDayMetGoal) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        
        streakAtLastGoalDate = tempStreak;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    if (lastGoalMetDate === today || lastGoalMetDate === yesterday) {
      currentStreak = streakAtLastGoalDate;
    }

    return {
      currentStreak,
      bestStreak,
      totalDaysMetGoal,
      totalWaterConsumed,
      lastActivityDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : today,
    };
  };

  const getDateBefore = (dateStr: string): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const getDateAfter = (dateStr: string): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const updateStats = async () => {
    try {
      const newStats = calculateStats();
      const oldStats = stats;
      
      await StorageService.saveStats(newStats);
      setStats(newStats);

      const newlyUnlocked = await AchievementService.checkAndUnlockAchievements(newStats);
      
      if (newlyUnlocked.length > 0 && oldStats) {
        const achievementTitles = newlyUnlocked
          .map(id => ACHIEVEMENTS.find(a => a.id === id)?.title)
          .filter(Boolean)
          .join(', ');
        
        Alert.alert(
          'Achievement Unlocked!',
          `Congratulations! You earned: ${achievementTitles}`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  const refreshStats = async () => {
    await updateStats();
  };

  const addWater = async (amount: number) => {
    try {
      const now = new Date();
      const newLog: WaterLog = {
        id: Date.now().toString(),
        amount,
        timestamp: now.getTime(),
        date: now.toISOString().split('T')[0],
      };
      
      const updatedLogs = [...logs, newLog];
      await StorageService.saveWaterLogs(updatedLogs);
      setLogs(updatedLogs);
    } catch (error) {
      console.error('Failed to add water:', error);
    }
  };

  const removeWater = async (id: string) => {
    try {
      const updatedLogs = logs.filter(log => log.id !== id);
      await StorageService.saveWaterLogs(updatedLogs);
      setLogs(updatedLogs);
    } catch (error) {
      console.error('Failed to remove water:', error);
    }
  };

  const setDailyGoal = async (goal: number) => {
    try {
      await StorageService.saveDailyGoal(goal);
      setDailyGoalState(goal);
    } catch (error) {
      console.error('Failed to set daily goal:', error);
    }
  };

  const getTodayLogs = () => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter(log => log.date === today);
  };

  const todayIntake = getTodayLogs().reduce((sum, log) => sum + log.amount, 0);

  const getHistoricalData = () => {
    const dataByDate: { [key: string]: number } = {};
    
    logs.forEach(log => {
      if (dataByDate[log.date]) {
        dataByDate[log.date] += log.amount;
      } else {
        dataByDate[log.date] = log.amount;
      }
    });

    return Object.entries(dataByDate)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <WaterTrackingContext.Provider
      value={{
        logs,
        dailyGoal,
        todayIntake,
        stats,
        addWater,
        removeWater,
        setDailyGoal,
        getTodayLogs,
        getHistoricalData,
        refreshStats,
      }}
    >
      {children}
    </WaterTrackingContext.Provider>
  );
}

export function useWaterTracking() {
  const context = useContext(WaterTrackingContext);
  if (context === undefined) {
    throw new Error('useWaterTracking must be used within a WaterTrackingProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService, WaterLog } from '../utils/storage';
import { useAuth } from './useAuth';

interface WaterTrackingContextType {
  logs: WaterLog[];
  dailyGoal: number;
  todayIntake: number;
  addWater: (amount: number) => Promise<void>;
  removeWater: (id: string) => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  getTodayLogs: () => WaterLog[];
  getHistoricalData: () => { date: string; total: number }[];
}

const WaterTrackingContext = createContext<WaterTrackingContextType | undefined>(undefined);

export function WaterTrackingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [dailyGoal, setDailyGoalState] = useState(2000);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [savedLogs, savedGoal] = await Promise.all([
        StorageService.getWaterLogs(),
        StorageService.getDailyGoal(),
      ]);
      setLogs(savedLogs);
      setDailyGoalState(savedGoal);
    } catch (error) {
      console.error('Failed to load water tracking data:', error);
    }
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
        addWater,
        removeWater,
        setDailyGoal,
        getTodayLogs,
        getHistoricalData,
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

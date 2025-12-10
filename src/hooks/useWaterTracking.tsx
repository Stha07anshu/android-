import { useState, useEffect, useCallback } from 'react';
import { WaterTrackingService } from '../services/WaterTrackingService';
import { useAuth } from './useAuth';
import { WaterLog, DailyStats } from '../types';

export const useWaterTracking = () => {
  const { user } = useAuth();
  const [todayIntake, setTodayIntake] = useState(0);
  const [dailyGoal, setDailyGoalState] = useState(2000);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDailyGoalState(user.dailyGoal);
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const intake = await WaterTrackingService.getTodayIntake(user.id);
      const todayLogs = await WaterTrackingService.getTodayLogs(user.id);
      const userStats = await WaterTrackingService.getStats(user.id);
      
      setTodayIntake(intake);
      setLogs(todayLogs);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading water tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount: number) => {
    if (!user) return;
    
    try {
      await WaterTrackingService.addWater(user.id, amount);
      await loadData();
    } catch (error) {
      console.error('Error adding water:', error);
      throw error;
    }
  };

  const removeWater = async (logId: number) => {
    try {
      await WaterTrackingService.removeWater(logId);
      await loadData();
    } catch (error) {
      console.error('Error removing water:', error);
      throw error;
    }
  };

  const getTodayLogs = () => {
    return logs;
  };

  const getHistoricalData = useCallback(async (): Promise<DailyStats[]> => {
    if (!user) return [];
    return await WaterTrackingService.getHistoricalData(user.id, 30);
  }, [user]);

  const setDailyGoal = async (goal: number) => {
    setDailyGoalState(goal);
  };

  return {
    todayIntake,
    dailyGoal,
    logs,
    stats,
    loading,
    addWater,
    removeWater,
    getTodayLogs,
    getHistoricalData,
    setDailyGoal,
  };
};
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@hydrotrack:user',
  THEME: '@hydrotrack:theme',
  WATER_LOGS: '@hydrotrack:water_logs',
  DAILY_GOAL: '@hydrotrack:daily_goal',
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dailyGoal: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: number;
  date: string;
}

export const StorageService = {
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  },

  async getTheme(): Promise<'light' | 'dark' | null> {
    return (await AsyncStorage.getItem(KEYS.THEME)) as 'light' | 'dark' | null;
  },

  async saveWaterLogs(logs: WaterLog[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.WATER_LOGS, JSON.stringify(logs));
  },

  async getWaterLogs(): Promise<WaterLog[]> {
    const data = await AsyncStorage.getItem(KEYS.WATER_LOGS);
    return data ? JSON.parse(data) : [];
  },

  async saveDailyGoal(goal: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.DAILY_GOAL, goal.toString());
  },

  async getDailyGoal(): Promise<number> {
    const data = await AsyncStorage.getItem(KEYS.DAILY_GOAL);
    return data ? parseInt(data, 10) : 2000;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.USER, KEYS.WATER_LOGS, KEYS.DAILY_GOAL]);
  },
};

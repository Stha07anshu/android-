export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  avatar: string;
  dailyGoal: number;
  weight?: number;
  activityLevel?: string;
  createdAt: string;
}

export interface WaterLog {
  id: number;
  userId: number;
  amount: number;
  timestamp: number;
  date: string;
}

export interface DailyStats {
  date: string;
  total: number;
  logs: WaterLog[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  target: number;
}

export interface NotificationSettings {
  enabled: boolean;
  intervalHours: number;
  startHour: number;
  endHour: number;
}
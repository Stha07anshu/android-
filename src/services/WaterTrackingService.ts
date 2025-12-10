import database from '../database/database';
import { WaterLog, DailyStats } from '../types';

export class WaterTrackingService {
  static async addWater(userId: number, amount: number): Promise<WaterLog> {
    const db = database.getDatabase();
    const timestamp = Date.now();
    const date = new Date(timestamp).toISOString().split('T')[0];

    const result = await db.runAsync(
      'INSERT INTO water_logs (userId, amount, timestamp, date) VALUES (?, ?, ?, ?)',
      [userId, amount, timestamp, date]
    );

    return {
      id: result.lastInsertRowId,
      userId,
      amount,
      timestamp,
      date,
    };
  }

  static async removeWater(logId: number): Promise<void> {
    const db = database.getDatabase();
    await db.runAsync('DELETE FROM water_logs WHERE id = ?', [logId]);
  }

  static async getTodayIntake(userId: number): Promise<number> {
    const db = database.getDatabase();
    const today = new Date().toISOString().split('T')[0];

    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(amount), 0) as total FROM water_logs WHERE userId = ? AND date = ?',
      [userId, today]
    );

    return result?.total || 0;
  }

  static async getTodayLogs(userId: number): Promise<WaterLog[]> {
    const db = database.getDatabase();
    const today = new Date().toISOString().split('T')[0];

    const logs = await db.getAllAsync<WaterLog>(
      'SELECT * FROM water_logs WHERE userId = ? AND date = ? ORDER BY timestamp DESC',
      [userId, today]
    );

    return logs || [];
  }

  static async getHistoricalData(userId: number, days: number = 30): Promise<DailyStats[]> {
    const db = database.getDatabase();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const logs = await db.getAllAsync<WaterLog>(
      `SELECT * FROM water_logs 
       WHERE userId = ? AND date >= ? AND date <= ?
       ORDER BY date DESC, timestamp DESC`,
      [userId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );

    const groupedByDate: { [key: string]: DailyStats } = {};

    logs?.forEach((log) => {
      if (!groupedByDate[log.date]) {
        groupedByDate[log.date] = {
          date: log.date,
          total: 0,
          logs: [],
        };
      }
      groupedByDate[log.date].total += log.amount;
      groupedByDate[log.date].logs.push(log);
    });

    return Object.values(groupedByDate).sort((a, b) => b.date.localeCompare(a.date));
  }

  static async getStats(userId: number): Promise<any> {
    const historicalData = await this.getHistoricalData(userId, 30);
    
    if (historicalData.length === 0) {
      return {
        totalDays: 0,
        totalWater: 0,
        averageDaily: 0,
        bestDay: 0,
        currentStreak: 0,
      };
    }

    const totalWater = historicalData.reduce((sum, day) => sum + day.total, 0);
    const averageDaily = Math.round(totalWater / historicalData.length);
    const bestDay = Math.max(...historicalData.map(d => d.total));

    return {
      totalDays: historicalData.length,
      totalWater,
      averageDaily,
      bestDay,
      currentStreak: 0, // Calculate separately if needed
    };
  }
}
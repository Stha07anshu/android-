import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WaterLog, UserStats } from './storage';

export interface ExportOptions {
  includeLogs: boolean;
  includeStats: boolean;
}

export interface ExportResult {
  success: boolean;
  csvContent?: string;
  filename?: string;
  needsWebFallback?: boolean;
}

export const ExportService = {
  async exportToCSV(
    logs: WaterLog[],
    stats: UserStats | null,
    dailyGoal: number,
    userName: string,
    options: ExportOptions = { includeLogs: true, includeStats: true }
  ): Promise<ExportResult> {
    try {
      let csvContent = '';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `hydrotrack_export_${timestamp}.csv`;

      csvContent += `HydroTrack Export - ${new Date().toLocaleString()}\n`;
      csvContent += `User: ${userName}\n`;
      csvContent += `Daily Goal: ${dailyGoal} ml\n`;
      csvContent += `\n`;

      if (options.includeStats && stats) {
        csvContent += `=== STATISTICS ===\n`;
        csvContent += `Current Streak,${stats.currentStreak} days\n`;
        csvContent += `Best Streak,${stats.bestStreak} days\n`;
        csvContent += `Total Days Met Goal,${stats.totalDaysMetGoal} days\n`;
        csvContent += `Total Water Consumed,${(stats.totalWaterConsumed / 1000).toFixed(2)} L\n`;
        csvContent += `Last Activity,${stats.lastActivityDate}\n`;
        csvContent += `\n`;
      }

      if (options.includeLogs) {
        if (logs.length === 0) {
          csvContent += `=== WATER INTAKE LOGS ===\n`;
          csvContent += `No water intake logs available.\n`;
        } else {
        csvContent += `=== WATER INTAKE LOGS ===\n`;
        csvContent += `Date,Time,Amount (ml),Daily Total (ml),Goal Met\n`;

        const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
        const logsByDate: { [key: string]: WaterLog[] } = {};
        
        sortedLogs.forEach(log => {
          if (!logsByDate[log.date]) {
            logsByDate[log.date] = [];
          }
          logsByDate[log.date].push(log);
        });

        const dates = Object.keys(logsByDate).sort((a, b) => b.localeCompare(a));

        dates.forEach(date => {
          const dayLogs = logsByDate[date].sort((a, b) => b.timestamp - a.timestamp);
          const dailyTotal = dayLogs.reduce((sum, log) => sum + log.amount, 0);
          const goalMet = dailyTotal >= dailyGoal ? 'Yes' : 'No';

          dayLogs.forEach(log => {
            const logDate = new Date(log.timestamp).toLocaleDateString();
            const logTime = new Date(log.timestamp).toLocaleTimeString();
            csvContent += `${logDate},${logTime},${log.amount},${dailyTotal},${goalMet}\n`;
          });
        });
        }
      }

      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return {
          success: true,
          csvContent,
          filename,
          needsWebFallback: true,
        };
      }
      
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export HydroTrack Data',
        UTI: 'public.comma-separated-values-text',
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Export failed:', error);
      return { success: false };
    }
  },

  async getExportPreview(logs: WaterLog[], stats: UserStats | null): Promise<string> {
    const totalLogs = logs.length;
    const dates = [...new Set(logs.map(log => log.date))].sort();
    const dateRange = dates.length > 0 
      ? `${dates[0]} to ${dates[dates.length - 1]}`
      : 'No data';

    let preview = `Export Summary:\n\n`;
    preview += `Total Logs: ${totalLogs}\n`;
    preview += `Date Range: ${dateRange}\n`;
    
    if (stats) {
      preview += `\nStatistics:\n`;
      preview += `• Current Streak: ${stats.currentStreak} days\n`;
      preview += `• Best Streak: ${stats.bestStreak} days\n`;
      preview += `• Days Met Goal: ${stats.totalDaysMetGoal}\n`;
      preview += `• Total Consumed: ${(stats.totalWaterConsumed / 1000).toFixed(2)}L\n`;
    }

    return preview;
  },
};

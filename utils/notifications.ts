import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './storage';

export interface NotificationSettings {
  enabled: boolean;
  intervalHours: number;
  startHour: number;
  endHour: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  intervalHours: 2,
  startHour: 8,
  endHour: 20,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  static async getSettings(): Promise<NotificationSettings> {
    const settings = await StorageService.getNotificationSettings();
    return settings || DEFAULT_SETTINGS;
  }

  static async saveSettings(settings: NotificationSettings): Promise<void> {
    if (settings.enabled) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        const disabledSettings = { ...settings, enabled: false };
        await StorageService.setNotificationSettings(disabledSettings);
        return;
      }
      await StorageService.setNotificationSettings(settings);
      await this.scheduleNotifications(settings);
    } else {
      await StorageService.setNotificationSettings(settings);
      await this.cancelAllNotifications();
    }
  }

  static async scheduleNotifications(settings: NotificationSettings): Promise<void> {
    await this.cancelAllNotifications();

    if (!settings.enabled || settings.intervalHours <= 0) {
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return;
    }

    const notificationTimes: { hour: number; minute: number }[] = [];
    
    for (let hour = settings.startHour; hour <= settings.endHour; hour += settings.intervalHours) {
      if (hour <= settings.endHour) {
        notificationTimes.push({ hour: hour >= 24 ? hour - 24 : hour, minute: 0 });
      }
    }

    for (const time of notificationTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Hydrate!',
          body: 'Remember to drink water and stay healthy.',
          data: { type: 'water_reminder' },
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
      });
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async initializeNotifications(): Promise<void> {
    const settings = await this.getSettings();
    if (settings.enabled) {
      const hasPermission = await this.requestPermissions();
      if (hasPermission) {
        await this.scheduleNotifications(settings);
      } else {
        const disabledSettings = { ...settings, enabled: false };
        await StorageService.setNotificationSettings(disabledSettings);
      }
    }
  }
}

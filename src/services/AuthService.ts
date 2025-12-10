import database from '../database/database';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_USER_KEY = '@current_user';

export class AuthService {
  static async register(email: string, name: string, password: string): Promise<User> {
    const db = database.getDatabase();
    
    // Check if email already exists
    const existing = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing) {
      throw new Error('Email already registered');
    }

    // Insert new user
    const result = await db.runAsync(
      'INSERT INTO users (email, name, password, avatar, dailyGoal) VALUES (?, ?, ?, ?, ?)',
      [email, name, password, 'avatar-waves', 2000]
    );

    const user: User = {
      id: result.lastInsertRowId,
      email,
      name,
      avatar: 'avatar-waves',
      dailyGoal: 2000,
      createdAt: new Date().toISOString(),
    };

    await this.saveCurrentUser(user);
    return user;
  }

  static async login(email: string, password: string): Promise<User> {
    const db = database.getDatabase();
    
    const user = await db.getFirstAsync<User>(
      'SELECT id, email, name, avatar, dailyGoal, weight, activityLevel, createdAt FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    await this.saveCurrentUser(user);
    return user;
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async saveCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  static async updateUser(user: User): Promise<void> {
    const db = database.getDatabase();
    
    await db.runAsync(
      'UPDATE users SET name = ?, avatar = ?, dailyGoal = ?, weight = ?, activityLevel = ? WHERE id = ?',
      [user.name, user.avatar, user.dailyGoal, user.weight || null, user.activityLevel || null, user.id]
    );

    await this.saveCurrentUser(user);
  }

  static async deleteAccount(userId: number): Promise<void> {
    const db = database.getDatabase();
    await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);
    await this.logout();
  }
}
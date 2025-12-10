import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';

const THEME_KEY = '@theme_preference';

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  colors: typeof Colors.light;
  toggleColorScheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  colors: Colors.light,
  toggleColorScheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setColorScheme(savedTheme as 'light' | 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newScheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, colors, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
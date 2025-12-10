import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useColorScheme = () => {
  const context = useContext(ThemeContext);
  return {
    colorScheme: context.colorScheme,
    toggleColorScheme: context.toggleColorScheme,
  };
};
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryScreen } from '../screens/HistoryScreen';
import { getCommonScreenOptions } from './screenOptions';
import { useTheme } from '../hooks/useTheme';

export type HistoryStackParamList = {
  HistoryMain: undefined;
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryStackNavigator() {
  const { theme, isDark } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen}
        options={{
          title: 'History',
        }}
      />
    </Stack.Navigator>
  );
}

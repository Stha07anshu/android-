import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  current: number;
  goal: number;
}

export function CircularProgress({ 
  progress, 
  size = 200, 
  strokeWidth = 16,
  current,
  goal 
}: CircularProgressProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (Math.min(progress, 1) * circumference);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress >= 1 ? colors.success : colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <ThemedText style={[styles.currentText, { color: colors.text }]}>
          {current}
        </ThemedText>
        <ThemedText style={[styles.unitText, { color: colors.textSecondary }]}>
          ml
        </ThemedText>
        <ThemedText style={[styles.goalText, { color: colors.textSecondary }]}>
          of {goal} ml
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  currentText: {
    fontSize: 40,
    fontWeight: '700',
  },
  unitText: {
    fontSize: 16,
    marginTop: 4,
  },
  goalText: {
    fontSize: 14,
    marginTop: 4,
  },
});

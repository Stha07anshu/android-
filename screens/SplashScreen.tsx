import { View, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
};

export function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacity.value = withSequence(
      withDelay(200, withSpring(1))
    );

    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [user, loading]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.content, logoStyle]}>
        <Image 
          source={require('../assets/images/splash-icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={[styles.title, { color: '#FFFFFF' }]}>
          HydroTrack
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: '#FFFFFF', opacity: 0.8 }]}>
          Stay Hydrated, Stay Healthy
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
});

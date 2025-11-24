import { useState } from 'react';
import { View, StyleSheet, Pressable, Image, Switch, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useAuth } from '@/hooks/useAuth';
import { useWaterTracking } from '@/hooks/useWaterTracking';
import { useTheme } from '@/hooks/useTheme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StorageService } from '@/utils/storage';
import { Spacing, BorderRadius } from '@/constants/theme';

const calculateWaterGoal = (weight: number, activityLevel: string): number => {
  const baseAmount = weight * 30;
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4,
  };
  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.0;
  return Math.round(baseAmount * multiplier);
};

type RootStackParamList = {
  Login: undefined;
};

const AVATARS = [
  { id: 'avatar-waves', source: require('@/assets/images/avatars/avatar-waves.png') },
  { id: 'avatar-ripples', source: require('@/assets/images/avatars/avatar-ripples.png') },
  { id: 'avatar-droplets', source: require('@/assets/images/avatars/avatar-droplets.png') },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Light', description: 'Exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week' },
  { id: 'active', label: 'Active', description: 'Exercise 6-7 days/week' },
  { id: 'very_active', label: 'Very Active', description: 'Intense daily exercise' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const { dailyGoal, setDailyGoal: saveDailyGoal } = useWaterTracking();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  const [showGoalCalculator, setShowGoalCalculator] = useState(false);
  const [weightInput, setWeightInput] = useState('70');
  const [selectedActivity, setSelectedActivity] = useState<string>('moderate');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());

  const calculatedGoal = weightInput ? calculateWaterGoal(parseInt(weightInput, 10) || 70, selectedActivity) : 2000;

  const handleOpenCalculator = () => {
    setWeightInput((user?.weight || 70).toString());
    setSelectedActivity(user?.activityLevel || 'moderate');
    setShowGoalCalculator(true);
  };

  const handleAvatarChange = async (avatarId: string) => {
    if (user) {
      await updateUser({ ...user, avatar: avatarId });
    }
  };

  const handleSaveGoal = async () => {
    const newGoal = parseInt(goalInput, 10);
    if (isNaN(newGoal) || newGoal <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid goal amount');
      return;
    }
    await saveDailyGoal(newGoal);
    if (user) {
      await updateUser({ ...user, dailyGoal: newGoal });
    }
    setIsEditingGoal(false);
  };

  const handleApplyCalculatedGoal = async () => {
    const weight = parseInt(weightInput, 10);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight');
      return;
    }
    
    await saveDailyGoal(calculatedGoal);
    if (user) {
      await updateUser({ 
        ...user, 
        dailyGoal: calculatedGoal,
        weight,
        activityLevel: selectedActivity as any
      });
    }
    setGoalInput(calculatedGoal.toString());
    setShowGoalCalculator(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This action cannot be undone and will delete all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This is your last chance. Delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    navigation.replace('Login');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const currentAvatar = AVATARS.find(a => a.id === user?.avatar) || AVATARS[0];

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image source={currentAvatar.source} style={styles.avatar} />
        <ThemedText style={[styles.name, { color: colors.text }]}>
          {user?.name}
        </ThemedText>
        <ThemedText style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Avatar
        </ThemedText>
        <View style={styles.avatarGrid}>
          {AVATARS.map((avatar) => (
            <Pressable
              key={avatar.id}
              onPress={() => handleAvatarChange(avatar.id)}
              style={({ pressed }) => [
                styles.avatarOption,
                {
                  borderColor: user?.avatar === avatar.id ? colors.primary : colors.border,
                  borderWidth: 2,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
            >
              <Image source={avatar.source} style={styles.avatarOptionImage} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Daily Water Goal
        </ThemedText>
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {isEditingGoal ? (
            <View style={styles.goalEditContainer}>
              <TextInput
                style={[styles.goalInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="number-pad"
                placeholder="Enter goal in ml"
                placeholderTextColor={colors.textSecondary}
              />
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveGoal}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          ) : (
            <>
              <Pressable 
                style={styles.settingRow}
                onPress={() => {
                  setGoalInput(dailyGoal.toString());
                  setIsEditingGoal(true);
                }}
              >
                <ThemedText style={[styles.settingLabel, { color: colors.text }]}>
                  {dailyGoal} ml per day
                </ThemedText>
                <MaterialCommunityIcons name="pencil" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.calculateButton,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={handleOpenCalculator}
              >
                <MaterialCommunityIcons name="calculator" size={18} color={colors.primary} />
                <ThemedText style={[styles.calculateButtonText, { color: colors.primary }]}>
                  Calculate Based on Weight & Activity
                </ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </ThemedText>
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons 
                name={colorScheme === 'dark' ? 'weather-night' : 'white-balance-sunny'} 
                size={24} 
                color={colors.text} 
              />
              <ThemedText style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </ThemedText>
            </View>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleColorScheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Account
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.logoutButton,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.text} />
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Logout
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.deleteButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleDeleteAccount}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
          <ThemedText style={[styles.buttonText, { color: '#FFFFFF' }]}>
            Delete Account
          </ThemedText>
        </Pressable>
      </View>

      <Modal
        visible={showGoalCalculator}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalCalculator(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowGoalCalculator(false)}
        >
          <Pressable 
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Calculate Water Goal
            </ThemedText>
            
            <View style={styles.calculatorSection}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>
                Your Weight (kg)
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                placeholder="Enter weight in kg"
                placeholderTextColor={colors.textSecondary}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.calculatorSection}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>
                Activity Level
              </ThemedText>
              {ACTIVITY_LEVELS.map((level) => (
                <Pressable
                  key={level.id}
                  style={({ pressed }) => [
                    styles.activityOption,
                    {
                      backgroundColor: selectedActivity === level.id ? colors.primary : colors.background,
                      borderColor: selectedActivity === level.id ? colors.primary : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    }
                  ]}
                  onPress={() => setSelectedActivity(level.id)}
                >
                  <View style={styles.activityContent}>
                    <ThemedText style={[
                      styles.activityLabel,
                      { color: selectedActivity === level.id ? '#FFFFFF' : colors.text }
                    ]}>
                      {level.label}
                    </ThemedText>
                    <ThemedText style={[
                      styles.activityDescription,
                      { color: selectedActivity === level.id ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                      {level.description}
                    </ThemedText>
                  </View>
                  {selectedActivity === level.id ? (
                    <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
                  ) : null}
                </Pressable>
              ))}
            </View>

            <View style={[styles.recommendationBox, { backgroundColor: colors.background, borderColor: colors.primary }]}>
              <ThemedText style={[styles.recommendationLabel, { color: colors.textSecondary }]}>
                Recommended Daily Goal
              </ThemedText>
              <ThemedText style={[styles.recommendationValue, { color: colors.primary }]}>
                {calculatedGoal} ml
              </ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelModalButton,
                  { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => setShowGoalCalculator(false)}
              >
                <ThemedText style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.applyButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={handleApplyCalculatedGoal}
              >
                <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  settingCard: {
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalEditContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  goalInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logoutButton: {
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  calculateButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.xl,
  },
  calculatorSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    fontSize: 13,
  },
  recommendationBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  recommendationLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  recommendationValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
  },
  cancelModalButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {},
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

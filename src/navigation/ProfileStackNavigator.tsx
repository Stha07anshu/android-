import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/main/ProfileScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import { useTheme } from "../hooks/useTheme";
import { getCommonScreenOptions } from "../navigation/screenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  Achievements: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { colors } = useTheme();



  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ colors })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: "Achievements",
        }}
      />
    </Stack.Navigator>
  );
}

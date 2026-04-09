import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@/store/authStore';
import type { RootStackParams } from './types';

import { OnboardingStack } from './OnboardingStack';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParams>();

export function RootNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      )}
    </Stack.Navigator>
  );
}

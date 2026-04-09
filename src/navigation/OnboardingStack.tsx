import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { OnboardingStackParams } from './types';

import { OnboardingSlides } from '@/screens/onboarding/OnboardingSlides';
import { LoginScreen } from '@/screens/onboarding/LoginScreen';

const Stack = createStackNavigator<OnboardingStackParams>();

export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingSlides" component={OnboardingSlides} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

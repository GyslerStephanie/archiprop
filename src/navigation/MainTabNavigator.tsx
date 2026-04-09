import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import type { MainTabParams } from './types';

// Screens (stubs for non-home tabs)
import { HomeStack } from './HomeStack';

function NavigateTab() {
  const { View, Text: RNText } = require('react-native');
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <RNText style={{ color: colors.textSecondary }}>Navigate</RNText>
    </View>
  );
}
function ProfileTab() {
  const { View, Text: RNText } = require('react-native');
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <RNText style={{ color: colors.textSecondary }}>Profile</RNText>
    </View>
  );
}
function SettingsTab() {
  const { View, Text: RNText } = require('react-native');
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <RNText style={{ color: colors.textSecondary }}>Settings</RNText>
    </View>
  );
}

const Tab = createBottomTabNavigator<MainTabParams>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Navigate: '◎',
    Profile: '◉',
    Settings: '⚙',
  };
  return (
    <Text style={[styles.icon, focused && styles.iconActive]}>{icons[name] ?? '●'}</Text>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Navigate" component={NavigateTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
      <Tab.Screen name="Settings" component={SettingsTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: spacing.sm,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  icon: {
    fontSize: 20,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.teal,
  },
});

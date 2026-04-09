import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { HomeStackParams } from './types';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { QRScanScreen } from '@/screens/qr/QRScanScreen';
import { DownloadScreen } from '@/screens/download/DownloadScreen';
import { LidarScanScreen } from '@/screens/ar/LidarScanScreen';
import { PlaceModelScreen } from '@/screens/ar/PlaceModelScreen';

const Stack = createStackNavigator<HomeStackParams>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="QRScan" component={QRScanScreen} />
      <Stack.Screen name="Download" component={DownloadScreen} />
      <Stack.Screen name="LidarScan" component={LidarScanScreen} />
      <Stack.Screen name="PlaceModel" component={PlaceModelScreen} />
    </Stack.Navigator>
  );
}

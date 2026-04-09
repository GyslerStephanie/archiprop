import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { colors, spacing } from '@/theme';
import type { HomeStackParams } from '@/navigation/types';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<HomeStackParams, 'LidarScan'>;
type RouteType = RouteProp<HomeStackParams, 'LidarScan'>;

// Random scattered dot positions for LiDAR point cloud visual effect
const DOTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 0.85 + 0.05, // 5-90% across screen
  y: Math.random() * 0.6 + 0.1,   // 10-70% down screen
  delay: Math.random() * 1200,
  size: Math.random() * 4 + 3,
}));

function ScanIcon({ progress }: { progress: number }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.scanIcon, { transform: [{ rotate }] }]}>
      {/* Hexagonal scan icon using borders */}
      <View style={styles.hexOuter}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.hexArm,
              {
                transform: [{ rotate: `${i * 60}deg` }],
              },
            ]}
          />
        ))}
        <View style={styles.hexCenter} />
      </View>
    </Animated.View>
  );
}

function PointDot({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 0.9, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.9, duration: 400, useNativeDriver: true }),
        Animated.delay(600),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
}

export function LidarScanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { projectId } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    // Simulate LiDAR scan progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.015;
      setScanProgress(Math.min(progress, 1));
      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => navigation.navigate('PlaceModel', { projectId }), 800);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Camera background */}
      {permission?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.noCameraFill]} />
      )}

      {/* Grayscale overlay to match design */}
      <View style={styles.grayOverlay} />

      {/* Point cloud dots */}
      {DOTS.map((dot) => (
        <PointDot key={dot.id} {...dot} />
      ))}

      {/* Central scan icon */}
      <View style={styles.centerContent}>
        <ScanIcon progress={scanProgress} />
      </View>

      {/* Bottom label */}
      <View style={styles.bottomBar}>
        <Text style={styles.scanLabel}>Scanning Site...</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  noCameraFill: {
    backgroundColor: '#2A2A2A',
  },
  grayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 40, 40, 0.45)',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexOuter: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexArm: {
    position: 'absolute',
    width: 28,
    height: 3,
    backgroundColor: colors.teal,
    borderRadius: 2,
    right: '50%',
    top: '50%',
    marginTop: -1.5,
  },
  hexCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.teal,
  },
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  scanLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: spacing.md,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4,
  },
});

import React, { useRef, useState, useEffect, Suspense } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { colors, spacing, radius } from '@/theme';
import type { HomeStackParams } from '@/navigation/types';
import { useARPositioning } from '@/hooks/useARPositioning';
import { useARStore } from '@/store/arStore';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<HomeStackParams, 'PlaceModel'>;
type RouteType = RouteProp<HomeStackParams, 'PlaceModel'>;

function AnchorButton({ onPress, isAnchored }: { onPress: () => void; isAnchored: boolean }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isAnchored) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.12, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [isAnchored]);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <TouchableOpacity
        style={[styles.anchorBtn, isAnchored && styles.anchorBtnActive]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.anchorInner} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function PlaceModelScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { projectId } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const { activeProject, isAnchored, setAnchored, localModelPath } = useARStore();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);

  const anchorLat = activeProject?.anchorLat ?? 47.3769;
  const anchorLng = activeProject?.anchorLng ?? 8.5417;
  const { position, distanceM, heading } = useARPositioning(anchorLat, anchorLng);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const onContextCreate = async (gl: WebGLRenderingContext) => {
    glRef.current = gl;
    const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

    // Renderer with transparent background (camera feed shows through)
    const renderer = new Renderer({ gl });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0); // transparent
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0, 1.6, 0); // eye height ~1.6m

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Model group — will be positioned based on GPS
    const group = new THREE.Group();
    modelGroupRef.current = group;
    scene.add(group);

    // For demo: render a placeholder building wireframe
    // In production: load localModelPath .glb with THREE.GLTFLoader
    const buildingGeo = new THREE.BoxGeometry(20, 30, 15);
    const edges = new THREE.EdgesGeometry(buildingGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3a8a8e,
      transparent: true,
      opacity: 0.7,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 15; // base at ground level
    group.add(wireframe);

    // Transparent fill
    const fillMat = new THREE.MeshPhongMaterial({
      color: 0x8899aa,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const solid = new THREE.Mesh(buildingGeo, fillMat);
    solid.position.y = 15;
    group.add(solid);

    // Render loop
    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      // Update model position from GPS
      if (modelGroupRef.current && !isAnchored) {
        const [x, y, z] = position;
        modelGroupRef.current.position.set(x, y, z);
      }

      // Slow rotation for demo when no real positioning
      if (modelGroupRef.current && distanceM > 500) {
        modelGroupRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
      (gl as any).endFrameEXP();
    };
    render();
  };

  const handleAnchor = () => {
    setAnchored(true);
    // Lock model at current GPS position
    if (modelGroupRef.current) {
      const [x, y, z] = position;
      modelGroupRef.current.position.set(x, y, z);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Camera background */}
      {permission?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.noCameraFill]} />
      )}

      {/* Three.js AR overlay */}
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* GPS debug info (helpful during testing) */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          {distanceM < 1000
            ? `${Math.round(distanceM)}m to anchor`
            : `${(distanceM / 1000).toFixed(1)}km to anchor`}
        </Text>
        <Text style={styles.debugText}>Heading: {heading}°</Text>
      </View>

      {/* Anchor button */}
      <View style={styles.bottomSection}>
        <AnchorButton onPress={handleAnchor} isAnchored={isAnchored} />
        <Text style={styles.anchorLabel}>
          {isAnchored ? 'Building Anchored ✓' : 'Press to Anchor Building'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  noCameraFill: {
    backgroundColor: '#222',
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
  debugInfo: {
    position: 'absolute',
    top: 54,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: 2,
  },
  debugText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  anchorBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(58, 138, 142, 0.3)',
    borderWidth: 3,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchorBtnActive: {
    backgroundColor: colors.teal,
  },
  anchorInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal,
  },
  anchorLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '@/components/ui';
import { colors, spacing, radius, typography } from '@/theme';
import type { HomeStackParams } from '@/navigation/types';
import { useARStore } from '@/store/arStore';

const { height } = Dimensions.get('window');

// Demo project sites in Zurich
const DEMO_PROJECTS = [
  {
    id: 'proj-001',
    name: 'Hardbrücke Tower',
    architect: 'Studio Zurich',
    status: 'planning' as const,
    anchorLat: 47.3853,
    anchorLng: 8.5237,
    anchorElevation: 0,
    ifcNorthOffset: 0,
    modelUrl: '', // Will be filled with Supabase URL
    qrToken: 'AP-001',
  },
  {
    id: 'proj-002',
    name: 'Langstrasse Residenz',
    architect: 'Architektur AG',
    status: 'under_construction' as const,
    anchorLat: 47.3779,
    anchorLng: 8.5282,
    anchorElevation: 0,
    ifcNorthOffset: 15,
    modelUrl: '',
    qrToken: 'AP-002',
  },
  {
    id: 'proj-003',
    name: 'Zürich West Pavilion',
    architect: 'Herzog & de Meuron',
    status: 'complete' as const,
    anchorLat: 47.3876,
    anchorLng: 8.5196,
    anchorElevation: 0,
    ifcNorthOffset: 0,
    modelUrl: '',
    qrToken: 'AP-003',
  },
];

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#556070' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a3040' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8b95a5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1f35' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3a8a8e' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e2433' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#222838' }] },
];

type NavigationProp = StackNavigationProp<HomeStackParams, 'HomeMain'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { setActiveProject } = useARStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = () => {
    navigation.navigate('QRScan');
  };

  const handleMarkerPress = (projectId: string) => {
    setSelectedId(projectId === selectedId ? null : projectId);
  };

  const handleProjectAR = (project: typeof DEMO_PROJECTS[0]) => {
    setActiveProject(project);
    navigation.navigate('QRScan');
  };

  const selectedProject = DEMO_PROJECTS.find((p) => p.id === selectedId);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Header showProfile onProfile={() => {}} />

      {/* Get started section */}
      <View style={styles.section}>
        <Text style={[typography.h3, styles.sectionTitle]}>Get started with AR</Text>
        <Text style={styles.sectionBody}>
          Once at empty site, search for QR code to download building model info.
        </Text>
        <TouchableOpacity
          style={[styles.startBtn, selectedId && styles.startBtnActive]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* Map section */}
      <View style={styles.mapSection}>
        <Text style={[typography.h3, styles.sectionTitle]}>Search AR sites!</Text>
        <Text style={styles.sectionBody}>
          Enter your location and search for sites around your area with QR codes for AR. Click Map to get started
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          customMapStyle={DARK_MAP_STYLE}
          initialRegion={{
            latitude: 47.3769,
            longitude: 8.5417,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          {DEMO_PROJECTS.map((project) => (
            <Marker
              key={project.id}
              coordinate={{ latitude: project.anchorLat, longitude: project.anchorLng }}
              onPress={() => handleMarkerPress(project.id)}
            >
              <View style={[styles.marker, selectedId === project.id && styles.markerSelected]}>
                <View style={styles.markerDot} />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* City label overlay */}
        <View style={styles.cityLabel}>
          <Text style={styles.cityText}>Zurich</Text>
        </View>

        {/* Selected project card */}
        {selectedProject && (
          <View style={styles.projectCard}>
            <View>
              <Text style={styles.projectName}>{selectedProject.name}</Text>
              <Text style={styles.projectMeta}>{selectedProject.architect}</Text>
              <View style={[styles.statusBadge, styles[`status_${selectedProject.status}`]]}>
                <Text style={styles.statusText}>{selectedProject.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.arBtn}
              onPress={() => handleProjectAR(selectedProject)}
            >
              <Text style={styles.arBtnText}>View AR →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  mapSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 17,
  },
  sectionBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  startBtn: {
    height: 48,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  startBtnActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  startBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    marginTop: spacing.sm,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(58, 138, 142, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.teal,
  },
  markerSelected: {
    backgroundColor: colors.teal,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
  },
  cityLabel: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  projectCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  projectName: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  projectMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  status_planning: { backgroundColor: 'rgba(58,138,142,0.2)' },
  status_under_construction: { backgroundColor: 'rgba(240,165,0,0.2)' },
  status_complete: { backgroundColor: 'rgba(76,175,130,0.2)' },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  arBtn: {
    backgroundColor: colors.teal,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  arBtnText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
});

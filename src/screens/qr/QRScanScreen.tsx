import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '@/components/ui';
import { colors, spacing, radius } from '@/theme';
import type { HomeStackParams } from '@/navigation/types';
import { useARStore } from '@/store/arStore';

const { width } = Dimensions.get('window');
const VIEWFINDER_SIZE = width * 0.75;

type NavigationProp = StackNavigationProp<HomeStackParams, 'QRScan'>;

export function QRScanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { activeProject, setActiveProject } = useARStore();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    // Parse archiprop://project/{id} or plain token like "AP-001"
    let projectId = data;
    const match = data.match(/archiprop:\/\/project\/(.+)/);
    if (match) projectId = match[1];

    // For demo: map tokens to project IDs
    const TOKEN_MAP: Record<string, string> = {
      'AP-001': 'proj-001',
      'AP-002': 'proj-002',
      'AP-003': 'proj-003',
    };
    const resolvedId = TOKEN_MAP[projectId] ?? projectId;

    // Set active project if not already set from map
    if (!activeProject || activeProject.id !== resolvedId) {
      // In a real app: fetch from Supabase by ID
      Alert.alert('QR Code Detected', `Project: ${resolvedId}\nNavigating to download...`, [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Download', { projectId: resolvedId }),
        },
      ]);
    } else {
      navigation.navigate('Download', { projectId: resolvedId });
    }
  };

  const handleSearch = () => {
    // Navigate using current active project or show picker
    if (activeProject) {
      navigation.navigate('Download', { projectId: activeProject.id });
    } else {
      Alert.alert('No project selected', 'Please select a site from the map or scan a QR code.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header onBack={() => navigation.goBack()} />

      <Text style={styles.title}>Scan the QR code of the{'\n'}device</Text>

      {/* Viewfinder */}
      <View style={styles.viewfinderContainer}>
        {scanning && permission?.granted ? (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        ) : (
          <View style={styles.viewfinderPlaceholder} />
        )}

        {/* Corner brackets */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      <Text style={styles.hint}>
        The QR code will be automatically detected{'\n'}when you position it between the guide lines
      </Text>

      {/* Refresh/retry */}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, scanning && styles.actionBtnActive]}
          onPress={() => {
            setScanning(!scanning);
            setScanned(false);
          }}
        >
          <Text style={styles.actionBtnText}>Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleSearch}>
          <Text style={styles.actionBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  viewfinderContainer: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    borderRadius: radius.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  viewfinderPlaceholder: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.textPrimary,
  },
  cornerTL: { top: 8, left: 8, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 3, borderRightWidth: 3 },
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  refreshBtn: {
    marginTop: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    color: colors.teal,
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 'auto',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnActive: {
    borderColor: colors.teal,
    backgroundColor: 'rgba(58,138,142,0.15)',
  },
  actionBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});

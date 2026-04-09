import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { Header, ProgressBar } from '@/components/ui';
import { colors, spacing, radius } from '@/theme';
import type { HomeStackParams } from '@/navigation/types';
import { useARStore } from '@/store/arStore';
import { useModelCache } from '@/hooks/useModelCache';

type NavigationProp = StackNavigationProp<HomeStackParams, 'Download'>;
type RouteType = RouteProp<HomeStackParams, 'Download'>;

// Placeholder building image (will be replaced with Supabase thumbnail)
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

export function DownloadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { projectId } = route.params;
  const { activeProject, downloadProgress, setActiveProject } = useARStore();
  const { downloadModel, isDownloading } = useModelCache();

  const project = activeProject?.id === projectId ? activeProject : null;
  const projectName = project?.name ?? `Project ${projectId}`;
  const modelUrl = project?.modelUrl ?? '';
  const thumbnailUrl = project?.thumbnailUrl ?? PLACEHOLDER_IMAGE;

  useEffect(() => {
    // Start download if we have a model URL
    if (modelUrl) {
      downloadModel(modelUrl, projectId).then((localPath) => {
        if (localPath) {
          // Auto-navigate to LiDAR scan after download completes
          setTimeout(() => {
            navigation.navigate('LidarScan', { projectId });
          }, 500);
        }
      });
    } else {
      // Demo: simulate download progress and navigate after delay
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.08;
        useARStore.getState().setDownloadProgress(Math.min(progress, 1));
        if (progress >= 1) {
          clearInterval(interval);
          setTimeout(() => navigation.navigate('LidarScan', { projectId }), 500);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header onBack={() => navigation.goBack()} />

      <Text style={styles.title}>Preparing to Download{'\n'}AR Model</Text>

      {/* Building preview image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Project name */}
      <Text style={styles.projectName}>{projectName}</Text>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={downloadProgress} />
        <Text style={styles.progressText}>
          {downloadProgress < 1
            ? `${Math.round(downloadProgress * 100)}%`
            : 'Complete'}
        </Text>
      </View>
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
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  imageContainer: {
    width: '80%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  projectName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    width: '80%',
    marginTop: 'auto',
    marginBottom: spacing.xxl,
    gap: spacing.xs,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'right',
  },
});

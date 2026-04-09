import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import { useARStore } from '@/store/arStore';

const CACHE_DIR = FileSystem.cacheDirectory + 'models/';

/**
 * Downloads a .glb model to local cache. Returns cached path if already present.
 */
export function useModelCache() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDownloadProgress, setLocalModelPath } = useARStore();

  const downloadModel = useCallback(async (url: string, projectId: string): Promise<string | null> => {
    try {
      setIsDownloading(true);
      setError(null);
      setDownloadProgress(0);

      // Ensure cache dir exists
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }

      const filename = `${projectId}.glb`;
      const localPath = CACHE_DIR + filename;

      // Return cached file if already downloaded
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        setLocalModelPath(localPath);
        setDownloadProgress(1);
        return localPath;
      }

      // Download with progress tracking
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        (progress) => {
          const { totalBytesWritten, totalBytesExpectedToWrite } = progress;
          if (totalBytesExpectedToWrite > 0) {
            setDownloadProgress(totalBytesWritten / totalBytesExpectedToWrite);
          }
        },
      );

      const result = await downloadResumable.downloadAsync();
      if (result?.uri) {
        setLocalModelPath(result.uri);
        setDownloadProgress(1);
        return result.uri;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      return null;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { downloadModel, isDownloading, error };
}

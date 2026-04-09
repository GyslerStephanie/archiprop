import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  architect?: string;
  status: 'planning' | 'under_construction' | 'complete';
  anchorLat: number;
  anchorLng: number;
  anchorElevation: number;
  ifcNorthOffset: number;
  modelUrl: string;
  thumbnailUrl?: string;
  qrToken?: string;
}

interface ARState {
  activeProject: Project | null;
  localModelPath: string | null;
  downloadProgress: number;
  isAnchored: boolean;
  setActiveProject: (project: Project | null) => void;
  setLocalModelPath: (path: string | null) => void;
  setDownloadProgress: (progress: number) => void;
  setAnchored: (anchored: boolean) => void;
}

export const useARStore = create<ARState>((set) => ({
  activeProject: null,
  localModelPath: null,
  downloadProgress: 0,
  isAnchored: false,
  setActiveProject: (activeProject) => set({ activeProject }),
  setLocalModelPath: (localModelPath) => set({ localModelPath }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setAnchored: (isAnchored) => set({ isAnchored }),
}));

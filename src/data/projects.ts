import type { Project } from '@/store/arStore';

/**
 * Demo project sites in Zurich. Used as a fallback when Supabase is not
 * configured, so the app is usable without a backend.
 */
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Hardbrücke Tower',
    architect: 'Studio Zurich',
    status: 'planning',
    anchorLat: 47.3853,
    anchorLng: 8.5237,
    anchorElevation: 0,
    ifcNorthOffset: 0,
    modelUrl: '',
    qrToken: 'AP-001',
  },
  {
    id: 'proj-002',
    name: 'Langstrasse Residenz',
    architect: 'Architektur AG',
    status: 'under_construction',
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
    status: 'complete',
    anchorLat: 47.3876,
    anchorLng: 8.5196,
    anchorElevation: 0,
    ifcNorthOffset: 0,
    modelUrl: '',
    qrToken: 'AP-003',
  },
];

/** Shape of a row in the Supabase `projects` table (snake_case columns). */
interface ProjectRow {
  id: string;
  name: string;
  architect: string | null;
  status: Project['status'];
  anchor_lat: number;
  anchor_lng: number;
  anchor_elevation: number | null;
  ifc_north_offset: number | null;
  model_url: string | null;
  thumbnail_url: string | null;
  qr_token: string | null;
}

/** Map a Supabase row to the app's camelCase `Project` type. */
export function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    architect: row.architect ?? undefined,
    status: row.status,
    anchorLat: row.anchor_lat,
    anchorLng: row.anchor_lng,
    anchorElevation: row.anchor_elevation ?? 0,
    ifcNorthOffset: row.ifc_north_offset ?? 0,
    modelUrl: row.model_url ?? '',
    thumbnailUrl: row.thumbnail_url ?? undefined,
    qrToken: row.qr_token ?? undefined,
  };
}

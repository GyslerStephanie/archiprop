import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_PROJECTS, mapProjectRow } from '@/data/projects';
import type { Project } from '@/store/arStore';

/**
 * Loads project sites. Falls back to bundled demo projects when Supabase is
 * not configured, so the map/list always has content.
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) {
        return DEMO_PROJECTS;
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []).map(mapProjectRow);
    },
  });
}

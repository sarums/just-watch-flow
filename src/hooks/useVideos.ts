import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Video, VideoSource, VideoCategory } from '@/types/video';

function mapRow(row: any): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    source: row.source as VideoSource,
    embedUrl: row.embed_url,
    thumbnailUrl: row.thumbnail_url ?? '',
    category: row.category as VideoCategory,
    duration: row.duration ?? '0:00',
    views: Number(row.views ?? 0),
    addedAt: row.created_at,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
  };
}

async function fetchAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export function useAllVideos() {
  return useQuery({ queryKey: ['videos', 'all'], queryFn: fetchAllVideos });
}

export function useVideo(id: string | undefined) {
  return useQuery({
    queryKey: ['videos', 'one', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
  });
}
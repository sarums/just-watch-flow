import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Eye, ListVideo, FolderOpen } from 'lucide-react';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalPlaylists: 0, totalCategories: 0 });
  const [topVideos, setTopVideos] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [videosRes, playlistsRes, categoriesRes, topRes] = await Promise.all([
        supabase.from('videos').select('views'),
        supabase.from('playlists').select('id'),
        supabase.from('categories').select('id'),
        supabase.from('videos').select('id, title, views, category').order('views', { ascending: false }).limit(10),
      ]);

      const videos = videosRes.data || [];
      setStats({
        totalVideos: videos.length,
        totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
        totalPlaylists: playlistsRes.data?.length || 0,
        totalCategories: categoriesRes.data?.length || 0,
      });
      setTopVideos(topRes.data || []);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, icon: Film, color: 'text-primary' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-400' },
    { label: 'Playlists', value: stats.totalPlaylists, icon: ListVideo, color: 'text-blue-400' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Videos by Views</CardTitle>
        </CardHeader>
        <CardContent>
          {topVideos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet. Add some in the Videos section.</p>
          ) : (
            <div className="space-y-3">
              {topVideos.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{v.category}</p>
                  </div>
                  <span className="text-sm font-semibold">{Number(v.views).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

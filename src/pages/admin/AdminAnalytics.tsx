import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const fmtViews = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n || 0);
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalPlaylists: 0, totalCategories: 0 });
  const [topVideos, setTopVideos] = useState<any[]>([]);
  const [catBreakdown, setCatBreakdown] = useState<{ cat: string; views: number }[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [videosRes, playlistsRes, categoriesRes, topRes, recentRes] = await Promise.all([
        supabase.from('videos').select('views, category'),
        supabase.from('playlists').select('id'),
        supabase.from('categories').select('id'),
        supabase.from('videos').select('id, title, views, category').order('views', { ascending: false }).limit(10),
        supabase.from('videos').select('id, title, views, category, source, thumbnail_url, featured').order('created_at', { ascending: false }).limit(15),
      ]);

      const videos = videosRes.data || [];
      setStats({
        totalVideos: videos.length,
        totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
        totalPlaylists: playlistsRes.data?.length || 0,
        totalCategories: categoriesRes.data?.length || 0,
      });
      setTopVideos(topRes.data || []);
      setRecentVideos(recentRes.data || []);

      // Category breakdown
      const catMap: Record<string, number> = {};
      videos.forEach(v => {
        const c = v.category || 'Uncategorized';
        catMap[c] = (catMap[c] || 0) + (v.views || 0);
      });
      const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setCatBreakdown(sorted.map(([cat, views]) => ({ cat, views })));
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Videos', value: stats.totalVideos, sub: 'In library', colorClass: 'text-primary' },
    { label: 'Total Views', value: fmtViews(stats.totalViews), sub: 'All time', colorClass: 'text-blue-400' },
    { label: 'Playlists', value: stats.totalPlaylists, sub: 'Series', colorClass: 'text-green-400' },
    { label: 'Categories', value: stats.totalCategories, sub: 'Active', colorClass: 'text-purple-400' },
  ];

  const maxViews = topVideos[0]?.views || 1;
  const maxCat = catBreakdown[0]?.views || 1;
  const barColors = ['#f27d26', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">Dashboard Overview</h1>

      {/* STAT BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <div className="text-[0.7rem] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">{s.label}</div>
            <div className={`font-['Bebas_Neue'] text-4xl leading-none ${s.colorClass}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Videos */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <span className="font-bold text-sm">🏆 Top Videos by Views</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">#</th>
                <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Title</th>
                <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Cat</th>
                <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Views</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No data yet</td></tr>
              ) : topVideos.map((v, i) => {
                const pct = Math.round(((v.views || 0) / maxViews) * 100);
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1);
                return (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 w-8 text-center">{medal}</td>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-xs truncate max-w-[200px]">{v.title}</div>
                      <div className="mt-1 h-[3px] bg-white/[0.07] rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">{v.category || '—'}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-primary">{fmtViews(v.views || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <span className="font-bold text-sm">📂 Views by Category</span>
          </div>
          <div className="p-5 space-y-3">
            {catBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-sm">No view data yet</p>
            ) : catBreakdown.map((item, i) => (
              <div key={item.cat}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-foreground/80 truncate max-w-[65%]">{item.cat}</span>
                  <span className="text-xs text-muted-foreground font-mono">{fmtViews(item.views)}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((item.views / maxCat) * 100)}%`, background: barColors[i % barColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT VIDEOS TABLE */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="font-bold text-sm">🕐 Recent Videos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                {['Thumb', 'Title', 'Source', 'Category', 'Views', 'Featured'].map(h => (
                  <th key={h} className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentVideos.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No videos yet</td></tr>
              ) : recentVideos.map(v => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="w-14 aspect-video rounded bg-secondary overflow-hidden">
                      {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold truncate max-w-[260px]">{v.title}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-[0.72rem] font-bold px-2 py-0.5 rounded uppercase ${v.source === 'dailymotion' ? 'bg-blue-500 text-white' : 'bg-green-500 text-black'}`}>
                      {v.source === 'dailymotion' ? 'DM' : 'RB'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">{v.category || '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{fmtViews(v.views || 0)}</td>
                  <td className="px-4 py-2.5">
                    {v.featured ? (
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary">⭐ Hero</span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

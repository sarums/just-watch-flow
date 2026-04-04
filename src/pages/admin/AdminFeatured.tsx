import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type Video = { id: string; title: string; thumbnail_url: string; featured: boolean; category: string };

export default function AdminFeatured() {
  const [videos, setVideos] = useState<Video[]>([]);

  const loadData = async () => {
    const { data } = await supabase.from('videos').select('id, title, thumbnail_url, featured, category').order('title');
    setVideos(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('videos').update({ featured: !current }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: current ? 'Removed from featured' : 'Added to featured' }); loadData(); }
  };

  const featured = videos.filter(v => v.featured);
  const others = videos.filter(v => !v.featured);

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">⭐ Featured Videos</h1>

      {/* Currently Featured */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary">
          <span className="font-bold text-sm">⭐ Currently Featured ({featured.length})</span>
        </div>
        {featured.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No featured videos</div>
        ) : (
          <div className="divide-y divide-border">
            {featured.map(v => (
              <div key={v.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors">
                <div className="w-16 aspect-video rounded bg-secondary overflow-hidden shrink-0">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{v.category}</div>
                </div>
                <button onClick={() => toggleFeatured(v.id, true)} className="text-xs font-semibold px-3 py-1.5 rounded bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Videos */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary">
          <span className="font-bold text-sm">🎬 All Videos ({others.length})</span>
        </div>
        {others.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No videos available</div>
        ) : (
          <div className="divide-y divide-border">
            {others.map(v => (
              <div key={v.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors">
                <div className="w-16 aspect-video rounded bg-secondary overflow-hidden shrink-0">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{v.category}</div>
                </div>
                <button onClick={() => toggleFeatured(v.id, false)} className="text-xs font-semibold px-3 py-1.5 rounded bg-primary/10 border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  ⭐ Feature
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

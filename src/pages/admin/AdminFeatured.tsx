import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Star, StarOff } from 'lucide-react';

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
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: current ? 'Removed from featured' : 'Added to featured' });
      loadData();
    }
  };

  const featured = videos.filter(v => v.featured);
  const others = videos.filter(v => !v.featured);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Featured Videos</h1>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Currently Featured ({featured.length})</h2>
        {featured.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured videos.</p>
        ) : (
          <div className="grid gap-2">
            {featured.map(v => (
              <Card key={v.id}>
                <CardContent className="flex items-center gap-3 py-3">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="h-10 w-16 rounded object-cover bg-secondary" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{v.category}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleFeatured(v.id, true)}>
                    <StarOff className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">All Videos ({others.length})</h2>
        <div className="grid gap-2">
          {others.map(v => (
            <Card key={v.id}>
              <CardContent className="flex items-center gap-3 py-3">
                {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="h-10 w-16 rounded object-cover bg-secondary" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{v.category}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toggleFeatured(v.id, false)}>
                  <Star className="h-4 w-4 mr-1" /> Feature
                </Button>
              </CardContent>
            </Card>
          ))}
          {others.length === 0 && <p className="text-sm text-muted-foreground">No videos available.</p>}
        </div>
      </div>
    </div>
  );
}

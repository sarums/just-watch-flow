import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

type Video = { id: string; title: string; views: number; category: string };

export default function AdminViews() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editedViews, setEditedViews] = useState<Record<string, number>>({});

  const loadData = async () => {
    const { data } = await supabase.from('videos').select('id, title, views, category').order('views', { ascending: false });
    setVideos(data || []);
    setEditedViews({});
  };

  useEffect(() => { loadData(); }, []);

  const updateViews = async (id: string) => {
    const newViews = editedViews[id];
    if (newViews === undefined) return;
    const { error } = await supabase.from('videos').update({ views: newViews }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'View count updated' });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">View Count Editor</h1>
      <p className="text-sm text-muted-foreground">Manually adjust view counts for any video.</p>

      {videos.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No videos yet.</CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {videos.map(v => (
            <Card key={v.id}>
              <CardContent className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{v.category}</p>
                </div>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={v.views}
                  onChange={e => setEditedViews(prev => ({ ...prev, [v.id]: parseInt(e.target.value) || 0 }))}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateViews(v.id)}
                  disabled={editedViews[v.id] === undefined}
                >
                  <Save className="h-3 w-3 mr-1" /> Save
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

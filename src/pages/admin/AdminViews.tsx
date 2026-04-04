import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

type Video = { id: string; title: string; views: number; category: string };

const fmtViews = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n || 0);
};

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
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'View count updated' }); loadData(); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">👁️ View Count Editor</h1>
      <p className="text-sm text-muted-foreground">Manually adjust view counts for any video.</p>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Title</th>
              <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Category</th>
              <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">Current</th>
              <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">New Value</th>
              <th className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border"></th>
            </tr>
          </thead>
          <tbody>
            {videos.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No videos yet</td></tr>
            ) : videos.map(v => (
              <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-2.5 font-semibold truncate max-w-[200px]">{v.title}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">{v.category}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-primary">{fmtViews(v.views)}</td>
                <td className="px-4 py-2.5">
                  <Input
                    type="number"
                    className="w-28 bg-secondary border-border h-8 text-xs"
                    defaultValue={v.views}
                    onChange={e => setEditedViews(prev => ({ ...prev, [v.id]: parseInt(e.target.value) || 0 }))}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => updateViews(v.id)}
                    disabled={editedViews[v.id] === undefined}
                    className="text-xs font-semibold px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    💾 Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

type Playlist = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
};

type VideoOption = { id: string; title: string };

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [allVideos, setAllVideos] = useState<VideoOption[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [form, setForm] = useState({ title: '', description: '', thumbnail_url: '', category: '' });
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [pRes, cRes, vRes] = await Promise.all([
      supabase.from('playlists').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('value, label').order('sort_order'),
      supabase.from('videos').select('id, title').order('title'),
    ]);
    setPlaylists(pRes.data || []);
    setCategories(cRes.data || []);
    setAllVideos(vRes.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', thumbnail_url: '', category: '' });
    setSelectedVideoIds([]);
    setDialogOpen(true);
  };

  const openEdit = async (pl: Playlist) => {
    setEditing(pl);
    setForm({ title: pl.title, description: pl.description, thumbnail_url: pl.thumbnail_url, category: pl.category });
    const { data } = await supabase.from('playlist_videos').select('video_id').eq('playlist_id', pl.id).order('sort_order');
    setSelectedVideoIds(data?.map(d => d.video_id) || []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({ title: 'Title required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      let playlistId: string;
      if (editing) {
        const { error } = await supabase.from('playlists').update(form).eq('id', editing.id);
        if (error) throw error;
        playlistId = editing.id;
      } else {
        const { data, error } = await supabase.from('playlists').insert(form).select('id').single();
        if (error) throw error;
        playlistId = data.id;
      }

      // Update playlist videos
      await supabase.from('playlist_videos').delete().eq('playlist_id', playlistId);
      if (selectedVideoIds.length > 0) {
        const rows = selectedVideoIds.map((vid, i) => ({ playlist_id: playlistId, video_id: vid, sort_order: i }));
        await supabase.from('playlist_videos').insert(rows);
      }

      toast({ title: editing ? 'Playlist updated' : 'Playlist created' });
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this playlist?')) return;
    const { error } = await supabase.from('playlists').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Playlist deleted' });
      loadData();
    }
  };

  const toggleVideo = (videoId: string) => {
    setSelectedVideoIds(prev =>
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newIds = [...selectedVideoIds];
    const swap = direction === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= newIds.length) return;
    [newIds[index], newIds[swap]] = [newIds[swap], newIds[index]];
    setSelectedVideoIds(newIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Playlists</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Create Playlist</Button>
      </div>

      {playlists.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No playlists yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {playlists.map(pl => (
            <Card key={pl.id}>
              <CardContent className="flex items-center gap-4 py-3">
                {pl.thumbnail_url && (
                  <img src={pl.thumbnail_url} alt="" className="h-14 w-24 rounded object-cover shrink-0 bg-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{pl.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{pl.category}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(pl)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(pl.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Playlist' : 'Create Playlist'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Thumbnail URL</label>
              <Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Videos in Playlist</label>
              {selectedVideoIds.length > 0 && (
                <div className="space-y-1 mt-2 mb-3">
                  {selectedVideoIds.map((vid, i) => {
                    const v = allVideos.find(x => x.id === vid);
                    return (
                      <div key={vid} className="flex items-center gap-2 rounded bg-secondary p-2 text-sm">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                        <span className="flex-1 truncate">{v?.title || vid}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-1" onClick={() => moveVideo(i, 'up')} disabled={i === 0}>↑</Button>
                        <Button variant="ghost" size="sm" className="h-6 px-1" onClick={() => moveVideo(i, 'down')} disabled={i === selectedVideoIds.length - 1}>↓</Button>
                        <Button variant="ghost" size="sm" className="h-6 px-1 text-destructive" onClick={() => toggleVideo(vid)}>×</Button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                {allVideos.filter(v => !selectedVideoIds.includes(v.id)).map(v => (
                  <button key={v.id} onClick={() => toggleVideo(v.id)} className="w-full text-left text-sm px-2 py-1 rounded hover:bg-muted truncate">
                    + {v.title}
                  </button>
                ))}
                {allVideos.length === 0 && <p className="text-xs text-muted-foreground p-2">No videos available. Add videos first.</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

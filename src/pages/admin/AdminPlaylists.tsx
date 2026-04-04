import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

type Playlist = { id: string; title: string; description: string; thumbnail_url: string; category: string; created_at: string };
type VideoOption = { id: string; title: string; thumbnail_url: string };

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [allVideos, setAllVideos] = useState<VideoOption[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [form, setForm] = useState({ title: '', description: '', thumbnail_url: '', category: '' });
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [playlistVideos, setPlaylistVideos] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [pRes, cRes, vRes, pvRes] = await Promise.all([
      supabase.from('playlists').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('value, label').order('sort_order'),
      supabase.from('videos').select('id, title, thumbnail_url').order('title'),
      supabase.from('playlist_videos').select('playlist_id, video_id').order('sort_order'),
    ]);
    setPlaylists(pRes.data || []);
    setCategories(cRes.data || []);
    setAllVideos(vRes.data || []);
    const map: Record<string, string[]> = {};
    (pvRes.data || []).forEach(pv => {
      if (!map[pv.playlist_id]) map[pv.playlist_id] = [];
      map[pv.playlist_id].push(pv.video_id);
    });
    setPlaylistVideos(map);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', thumbnail_url: '', category: '' }); setSelectedVideoIds([]); setDialogOpen(true); };

  const openEdit = async (pl: Playlist) => {
    setEditing(pl);
    setForm({ title: pl.title, description: pl.description, thumbnail_url: pl.thumbnail_url, category: pl.category });
    const { data } = await supabase.from('playlist_videos').select('video_id').eq('playlist_id', pl.id).order('sort_order');
    setSelectedVideoIds(data?.map(d => d.video_id) || []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast({ title: 'Title required', variant: 'destructive' }); return; }
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
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this playlist?')) return;
    const { error } = await supabase.from('playlists').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Playlist deleted' }); loadData(); }
  };

  const toggleVideo = (videoId: string) => setSelectedVideoIds(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]);

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">Playlists</h1>

      {/* CREATE FORM */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="font-bold text-sm mb-5 flex items-center gap-2">➕ Create New Playlist</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Playlist Name</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Learn Piano Series" className="bg-secondary border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Description</label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." className="bg-secondary border-border" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Thumbnail URL <span className="text-muted-foreground/60 font-normal">(optional cover image)</span></label>
            <div className="flex gap-3">
              <Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://...image.jpg" className="bg-secondary border-border flex-1" />
              <div className="w-24 aspect-video rounded-md overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center text-muted-foreground text-[0.7rem]">
                {form.thumbnail_url ? <img src={form.thumbnail_url} alt="" className="w-full h-full object-cover" /> : 'No img'}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => { if (!form.title) { toast({ title: 'Name required', variant: 'destructive' }); return; } handleSave(); }} className="inline-flex items-center gap-2 bg-green-500 text-black font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          Create Playlist
        </button>
      </div>

      {/* PLAYLISTS LIST */}
      <div className="space-y-4">
        {playlists.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-3xl mb-2 opacity-40">📋</div>
            <div className="font-semibold">No playlists yet</div>
            <p className="text-xs mt-1">Create your first playlist above</p>
          </div>
        ) : playlists.map(pl => {
          const vidIds = playlistVideos[pl.id] || [];
          const vidDetails = vidIds.map(id => allVideos.find(v => v.id === id)).filter(Boolean);
          return (
            <div key={pl.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-secondary border-b border-border">
                <div className="font-bold text-sm flex items-center gap-2">
                  📋 {pl.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{vidIds.length} videos</span>
                  <button onClick={() => openEdit(pl)} className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">✏️ Edit</button>
                  <button onClick={() => handleDelete(pl.id)} className="text-xs font-semibold px-2.5 py-1 rounded bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all">🗑️</button>
                </div>
              </div>
              {vidDetails.length > 0 && (
                <div className="divide-y divide-border">
                  {vidDetails.map((v, i) => v && (
                    <div key={v.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/50 transition-colors">
                      <span className="font-mono text-xs text-muted-foreground w-5 text-center shrink-0">{i + 1}</span>
                      <div className="w-16 aspect-video rounded bg-secondary overflow-hidden shrink-0">
                        {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{v.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary sticky top-0 z-10">
            <DialogHeader className="p-0">
              <DialogTitle className="font-['Bebas_Neue'] text-xl tracking-[2px] text-primary">
                {editing ? '✏️ Edit Playlist' : '📋 Create Playlist'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Title *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Thumbnail URL</label>
              <Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Category</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Videos in Playlist</label>
              {selectedVideoIds.length > 0 && (
                <div className="space-y-1 mt-2 mb-3">
                  {selectedVideoIds.map((vid, i) => {
                    const v = allVideos.find(x => x.id === vid);
                    return (
                      <div key={vid} className="flex items-center gap-2 rounded bg-secondary p-2 text-sm">
                        <span className="font-mono text-xs text-muted-foreground w-5">{i+1}</span>
                        <span className="flex-1 truncate">{v?.title || vid}</span>
                        <button className="text-xs text-destructive hover:text-white hover:bg-destructive px-1.5 py-0.5 rounded transition-all" onClick={() => toggleVideo(vid)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-2 space-y-1 bg-secondary">
                {allVideos.filter(v => !selectedVideoIds.includes(v.id)).map(v => (
                  <button key={v.id} onClick={() => toggleVideo(v.id)} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-card truncate transition-colors">
                    + {v.title}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40">
              {loading ? 'Saving…' : '💾 Save'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Search, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Video = {
  id: string; title: string; description: string; source: string; embed_url: string;
  thumbnail_url: string; category: string; duration: string; views: number;
  featured: boolean; tags: string[]; created_at: string;
};

const emptyVideo = {
  title: '', description: '', source: 'dailymotion' as string, embed_url: '',
  thumbnail_url: '', category: '', duration: '0:00', views: 0,
  featured: false, tags: [] as string[],
};

const fmtViews = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n || 0);
};

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState(emptyVideo);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('dailymotion');

  const loadData = async () => {
    const [vRes, cRes] = await Promise.all([
      supabase.from('videos').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('value, label').order('sort_order'),
    ]);
    setVideos(vRes.data || []);
    setCategories(cRes.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = videos.filter(v => {
    const mQ = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
    const mS = !filterSource || v.source === filterSource;
    const mC = !filterCat || v.category === filterCat;
    return mQ && mS && mC;
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyVideo);
    setTagsInput('');
    setPlatform('dailymotion');
    setDialogOpen(true);
  };

  const openEdit = (video: Video) => {
    setEditing(video);
    setForm({ title: video.title, description: video.description, source: video.source, embed_url: video.embed_url, thumbnail_url: video.thumbnail_url, category: video.category, duration: video.duration, views: video.views, featured: video.featured, tags: video.tags });
    setTagsInput(video.tags.join(', '));
    setPlatform(video.source);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.embed_url || !form.category) {
      toast({ title: 'Missing fields', description: 'Title, URL, and category are required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, source: platform, tags };
    try {
      if (editing) {
        const { error } = await supabase.from('videos').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Video updated' });
      } else {
        const { error } = await supabase.from('videos').insert(payload);
        if (error) throw error;
        toast({ title: 'Video added' });
      }
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Video deleted' }); loadData(); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('videos').update({ featured: !current }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: current ? 'Removed from featured' : 'Set as featured' }); loadData(); }
  };

  const platforms = [
    { value: 'dailymotion', label: '📺 Dailymotion', activeClass: 'border-blue-500 text-blue-400 bg-blue-500/[0.08]' },
    { value: 'rumble', label: '🟢 Rumble', activeClass: 'border-green-500 text-green-400 bg-green-500/[0.08]' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">All Videos</h1>

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-foreground text-sm w-full placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="bg-card border border-border text-foreground text-sm px-3 py-2 rounded-lg outline-none"
        >
          <option value="">All Platforms</option>
          <option value="dailymotion">Dailymotion</option>
          <option value="rumble">Rumble</option>
        </select>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-card border border-border text-foreground text-sm px-3 py-2 rounded-lg outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
          ➕ Add Video
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                {['Thumb', 'Title', 'Source', 'Category', 'Views', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[0.68rem] font-bold tracking-[1.5px] uppercase text-muted-foreground px-4 py-2.5 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="text-3xl mb-2 opacity-40">🎬</div>
                  <div className="font-semibold">No videos found</div>
                  <p className="text-xs mt-1">Try a different filter or add a new video</p>
                </td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="w-14 aspect-video rounded bg-secondary overflow-hidden">
                      {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold truncate max-w-[260px]">{v.title}</div>
                    <div className="text-[0.68rem] text-muted-foreground mt-0.5 font-mono">{v.duration || ''}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-[0.72rem] font-bold px-2 py-0.5 rounded uppercase ${v.source === 'dailymotion' ? 'bg-blue-500 text-white' : 'bg-green-500 text-black'}`}>
                      {v.source === 'dailymotion' ? 'DM' : 'RB'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">{v.category || '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{fmtViews(v.views)}</td>
                  <td className="px-4 py-2.5">
                    {v.featured ? (
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary">⭐ Hero</span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(v)} className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">✏️ Edit</button>
                      <button onClick={() => toggleFeatured(v.id, v.featured)} className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground transition-all" title={v.featured ? 'Remove' : 'Feature'}>⭐</button>
                      <button onClick={() => handleDelete(v.id)} className="text-xs font-semibold px-2.5 py-1 rounded bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary sticky top-0 z-10">
            <DialogHeader className="p-0">
              <DialogTitle className="font-['Bebas_Neue'] text-xl tracking-[2px] text-primary">
                {editing ? '✏️ Edit Video' : '🎬 Add Video'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5">
            {/* Platform Toggle */}
            <div className="grid grid-cols-2 gap-3">
              {platforms.map(p => (
                <button
                  key={p.value}
                  onClick={() => { setPlatform(p.value); setForm(f => ({ ...f, source: p.value })); }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm border-2 transition-all ${
                    platform === p.value ? p.activeClass : 'border-border bg-secondary text-muted-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Embed URL *</label>
                <Input value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} placeholder="https://..." className="bg-secondary border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Duration</label>
                <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="12:34" className="bg-secondary border-border" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Title *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-secondary border-border" />
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="bg-secondary border-border resize-y min-h-[80px]" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Category *</label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Views</label>
                <Input type="number" value={form.views} onChange={e => setForm({ ...form, views: parseInt(e.target.value) || 0 })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Featured</label>
                <Select value={form.featured ? 'yes' : 'no'} onValueChange={v => setForm({ ...form, featured: v === 'yes' })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">⭐ Yes — Hero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Thumbnail URL</label>
              <Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} className="bg-secondary border-border" />
              {form.thumbnail_url && (
                <div className="w-full aspect-video rounded-lg bg-secondary border-2 border-dashed border-border overflow-hidden mt-2">
                  <img src={form.thumbnail_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Tags (comma-separated)</label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tag1, tag2, tag3" className="bg-secondary border-border" />
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? 'Saving…' : editing ? '💾 Save Changes' : '➕ Add Video'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

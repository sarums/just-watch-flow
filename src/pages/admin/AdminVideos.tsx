import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Video = {
  id: string;
  title: string;
  description: string;
  source: string;
  embed_url: string;
  thumbnail_url: string;
  category: string;
  duration: string;
  views: number;
  featured: boolean;
  tags: string[];
  created_at: string;
};

const emptyVideo = {
  title: '',
  description: '',
  source: 'dailymotion' as string,
  embed_url: '',
  thumbnail_url: '',
  category: '',
  duration: '0:00',
  views: 0,
  featured: false,
  tags: [] as string[],
};

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState(emptyVideo);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [vRes, cRes] = await Promise.all([
      supabase.from('videos').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('value, label').order('sort_order'),
    ]);
    setVideos(vRes.data || []);
    setCategories(cRes.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyVideo);
    setTagsInput('');
    setDialogOpen(true);
  };

  const openEdit = (video: Video) => {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description,
      source: video.source,
      embed_url: video.embed_url,
      thumbnail_url: video.thumbnail_url,
      category: video.category,
      duration: video.duration,
      views: video.views,
      featured: video.featured,
      tags: video.tags,
    });
    setTagsInput(video.tags.join(', '));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.embed_url || !form.category) {
      toast({ title: 'Missing fields', description: 'Title, URL, and category are required.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags };

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
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Video deleted' });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display text-2xl font-bold">Videos</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Video</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No videos found. Click "Add Video" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(v => (
            <Card key={v.id}>
              <CardContent className="flex items-center gap-4 py-3">
                {v.thumbnail_url && (
                  <img src={v.thumbnail_url} alt="" className="h-16 w-28 rounded object-cover shrink-0 bg-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{v.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className={`rounded px-1.5 py-0.5 uppercase font-semibold ${
                      v.source === 'dailymotion' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                    }`}>{v.source}</span>
                    <span className="capitalize">{v.category}</span>
                    <span>{Number(v.views).toLocaleString()} views</span>
                    {v.featured && <span className="text-primary">★ Featured</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Video' : 'Add Video'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Embed URL *</label>
              <Input value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} placeholder="https://www.dailymotion.com/embed/video/..." />
            </div>
            <div>
              <label className="text-sm font-medium">Thumbnail URL</label>
              <Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Source *</label>
                <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dailymotion">Dailymotion</SelectItem>
                    <SelectItem value="rumble">Rumble</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="12:34" />
              </div>
              <div>
                <label className="text-sm font-medium">Views</label>
                <Input type="number" value={form.views} onChange={e => setForm({ ...form, views: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tag1, tag2, tag3" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
              <label htmlFor="featured" className="text-sm">Featured on homepage</label>
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

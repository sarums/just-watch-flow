import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Category = { id: string; value: string; label: string; icon: string; sort_order: number };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ value: '', label: '', icon: '📁', sort_order: 0 });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ value: '', label: '', icon: '📁', sort_order: categories.length });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ value: cat.value, label: cat.label, icon: cat.icon, sort_order: cat.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.value || !form.label) {
      toast({ title: 'Value and label required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase.from('categories').update(form).eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Category updated' });
      } else {
        const { error } = await supabase.from('categories').insert(form);
        if (error) throw error;
        toast({ title: 'Category added' });
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
    if (!confirm('Delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Category deleted' });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
      </div>

      <div className="grid gap-2">
        {categories.map(cat => (
          <Card key={cat.id}>
            <CardContent className="flex items-center gap-3 py-3">
              <span className="text-xl">{cat.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.value}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Slug/Value *</label>
              <Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="e.g. tech" disabled={!!editing} />
            </div>
            <div>
              <label className="text-sm font-medium">Display Label *</label>
              <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Technology" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Icon (emoji)</label>
                <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
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

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

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

  const openCreate = () => { setEditing(null); setForm({ value: '', label: '', icon: '📁', sort_order: categories.length }); setDialogOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ value: cat.value, label: cat.label, icon: cat.icon, sort_order: cat.sort_order }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.value || !form.label) { toast({ title: 'Value and label required', variant: 'destructive' }); return; }
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
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Category deleted' }); loadData(); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">🏷️ Categories</h1>

      {/* ADD FORM */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="font-bold text-sm mb-5 flex items-center gap-2">➕ Add Category</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Menu Label</label>
            <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Drama, Top Picks..." className="bg-secondary border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Slug</label>
            <Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="e.g. drama" className="bg-secondary border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Icon (emoji)</label>
            <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="bg-secondary border-border w-20" />
          </div>
          <div className="space-y-1">
            <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Sort Order</label>
            <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-secondary border-border w-20" />
          </div>
        </div>
        <button onClick={() => { openCreate(); handleSave(); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity w-full justify-center">
          ➕ Add to Menu
        </button>
      </div>

      {/* CATEGORIES LIST */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-sm">📋 Menu Items</span>
          <span className="text-xs text-muted-foreground">▲▼ to reorder</span>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-3xl mb-2 opacity-40">🏷️</div>
            <div className="font-semibold">No menu items</div>
            <p className="text-xs mt-1">Add your first item above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="bg-secondary border border-border rounded-lg px-4 py-3 flex items-center justify-between hover:border-border/80 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{cat.label}</div>
                    <div className="text-xs text-muted-foreground">{cat.value}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">✏️</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-xs font-semibold px-2 py-1 rounded bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm bg-card border-border p-0">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <DialogHeader className="p-0"><DialogTitle className="font-['Bebas_Neue'] text-xl tracking-[2px] text-primary">{editing ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Slug *</label>
              <Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="e.g. tech" disabled={!!editing} className="bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Display Label *</label>
              <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Icon</label>
                <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">Order</label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-secondary border-border" />
              </div>
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40">
              {loading ? 'Saving…' : '💾 Save'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

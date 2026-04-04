import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const { data } = await supabase.from('site_settings').select('key, value');
    const obj: Record<string, string> = {};
    data?.forEach(s => { obj[s.key] = s.value; });
    setSettings(obj);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from('site_settings').update({ value }).eq('key', key);
      }
      toast({ title: 'Settings saved' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'footer_text', label: 'Footer Text' },
    { key: 'admin_password', label: 'Change Admin Password', type: 'password' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-['Bebas_Neue'] text-3xl tracking-[2px]">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="font-bold text-sm mb-5 flex items-center gap-2">⚙️ Site Settings</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {fields.map(f => (
            <div key={f.key} className={`space-y-1 ${f.key === 'admin_password' ? 'md:col-span-2' : ''}`}>
              <label className="text-[0.7rem] font-bold tracking-[1px] uppercase text-muted-foreground">{f.label}</label>
              <Input
                type={f.type || 'text'}
                value={settings[f.key] || ''}
                onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.key === 'admin_password' ? 'Enter new password (leave blank to keep current)' : ''}
                className="bg-secondary border-border"
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          💾 {loading ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

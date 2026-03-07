import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'footer_text', label: 'Footer Text' },
    { key: 'admin_password', label: 'Admin Password', type: 'password' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Site Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-sm font-medium">{f.label}</label>
              <Input
                type={f.type || 'text'}
                value={settings[f.key] || ''}
                onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-1" /> {loading ? 'Saving…' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

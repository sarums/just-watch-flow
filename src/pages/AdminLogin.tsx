import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAdminToken } from '@/lib/admin-auth';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'admin_password').single();
      if (error) throw error;
      if (data.value === password) {
        const token = crypto.randomUUID();
        setAdminToken(token);
        toast({ title: 'Welcome back!', description: 'Admin access granted.' });
        navigate('/admin');
      } else {
        toast({ title: 'Wrong password', description: 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not verify password.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-10 w-full max-w-[380px] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
        <div className="font-['Bebas_Neue'] text-2xl tracking-[3px] mb-1">
          CLIPFLOW <span className="text-primary">ADMIN</span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Enter password to access dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[0.72rem] font-bold tracking-[1px] uppercase text-muted-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-secondary border-border pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Login →'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Default: <code className="rounded bg-secondary px-1.5 py-0.5">admin123</code>
        </p>
      </div>
    </div>
  );
}

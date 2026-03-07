import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAdminToken } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">ClipFlow Admin</h1>
          <p className="text-sm text-muted-foreground">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !password}>
            {loading ? 'Checking…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Default password: <code className="rounded bg-secondary px-1">admin123</code>
        </p>
      </div>
    </div>
  );
}

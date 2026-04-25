import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, clearAdminToken } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Home, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[hsl(var(--background))]">
      {/* TOPBAR */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 z-50 bg-[linear-gradient(90deg,hsl(225_15%_10%)_0%,hsl(225_18%_14%)_45%,hsl(32_60%_18%)_100%)] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
        <div className="font-['Bebas_Neue'] text-xl tracking-[3px] flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          CLIPFLOW <span className="text-gradient">ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 bg-secondary border border-border text-muted-foreground text-xs font-medium px-4 py-2 rounded-lg hover:border-primary hover:text-primary transition-all"
          >
            <Home className="h-3.5 w-3.5" /> Back to Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-destructive/10 border border-destructive/25 text-destructive text-xs font-semibold px-4 py-2 rounded-lg hover:bg-destructive hover:text-white transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

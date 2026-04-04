import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const sections = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Overview', url: '/admin', icon: '📊', end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { title: 'Videos', url: '/admin/videos', icon: '🎞️' },
      { title: 'Playlists', url: '/admin/playlists', icon: '📋' },
      { title: 'Categories', url: '/admin/categories', icon: '🏷️' },
      { title: 'Featured', url: '/admin/featured', icon: '⭐' },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'View Counts', url: '/admin/views', icon: '👁️' },
      { title: 'Settings', url: '/admin/settings', icon: '⚙️' },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (url: string, end?: boolean) => {
    if (end) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0 overflow-y-auto py-6">
      {sections.map((section, si) => (
        <div key={si}>
          <div className="text-[0.65rem] font-bold tracking-[2px] uppercase text-muted-foreground px-5 mb-2 mt-5 first:mt-0">
            {section.label}
          </div>
          {section.items.map((item) => {
            const active = isActive(item.url, item.end);
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all border-l-[3px] border-transparent',
                  active
                    ? 'text-primary bg-primary/[0.08] border-l-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

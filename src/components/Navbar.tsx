import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Play, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '@/types/video';

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">ClipFlow</span>
        </Link>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap ${
              location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Home
          </Link>
          {CATEGORIES.slice(0, 6).map(cat => (
            <Link
              key={cat.value}
              to={`/category/${cat.value}`}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap ${
                location.pathname === `/category/${cat.value}` ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            to="/categories"
            className="px-3 py-1.5 text-sm rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary whitespace-nowrap"
          >
            More…
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search videos…"
                className="h-9 w-40 md:w-56 rounded-full bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Mobile Menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 md:hidden text-muted-foreground hover:text-foreground">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground">
              Home
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                to={`/category/${cat.value}`}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground"
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

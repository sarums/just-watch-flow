import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { VideoRow } from '@/components/VideoRow';
import { useAllVideos } from '@/hooks/useVideos';
import { useMemo } from 'react';

const Index = () => {
  const { data: videos = [], isLoading } = useAllVideos();

  const featured = useMemo(() => videos.find(v => v.featured) ?? videos[0], [videos]);
  const trending = useMemo(
    () => [...videos].sort((a, b) => b.views - a.views).slice(0, 12),
    [videos]
  );
  const newArrivals = useMemo(
    () => [...videos].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 12),
    [videos]
  );
  const shuffled = useMemo(() => [...videos].sort(() => Math.random() - 0.5), [videos]);

  return (
    <div className="relative min-h-screen bg-[hsl(240_10%_4%)] overflow-hidden">
      {/* Ambient WeTV-style glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,hsl(280_60%_20%/0.45),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(ellipse_at_70%_20%,hsl(320_70%_25%/0.25),transparent_55%)]" />
      <Navbar />
      <main className="relative container pb-12">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading videos…</div>
        ) : videos.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No videos yet. Add some from the admin dashboard.</div>
        ) : (
          <>
            {featured && <HeroSection video={featured} />}
            <VideoRow title="Trending Now" icon="🔥" videos={trending} />
            <VideoRow title="New Arrivals" icon="✨" videos={newArrivals} />
            <VideoRow title="Discover" icon="🎲" videos={shuffled} />
          </>
        )}
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 ClipFlow — Free video aggregator. No tracking, no sign-up.</p>
      </footer>
    </div>
  );
};

export default Index;

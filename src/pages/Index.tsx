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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pb-12">
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

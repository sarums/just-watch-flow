import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { VideoRow } from '@/components/VideoRow';
import { getFeaturedVideo, getTrendingVideos, getNewArrivals, mockVideos } from '@/data/videos';

const Index = () => {
  const featured = getFeaturedVideo();
  const trending = getTrendingVideos();
  const newArrivals = getNewArrivals();

  // Shuffle remaining for discovery
  const shuffled = [...mockVideos].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pb-12">
        <HeroSection video={featured} />
        <VideoRow title="Trending Now" icon="🔥" videos={trending} />
        <VideoRow title="New Arrivals" icon="✨" videos={newArrivals} />
        <VideoRow title="Discover" icon="🎲" videos={shuffled} />
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 ClipFlow — Free video aggregator. No tracking, no sign-up.</p>
      </footer>
    </div>
  );
};

export default Index;

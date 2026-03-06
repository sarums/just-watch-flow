import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { getVideoById, mockVideos, getPlaylistById, formatViews } from '@/data/videos';
import { Eye, Share2, ArrowLeft, ListVideo } from 'lucide-react';
import { useState } from 'react';

const WatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || '');
  const [copied, setCopied] = useState(false);

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Video not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const playlist = video.playlistId ? getPlaylistById(video.playlistId) : null;
  const playlistVideos = playlist 
    ? playlist.videoIds.map(vid => mockVideos.find(v => v.id === vid)).filter(Boolean)
    : [];
  const currentIndex = playlist ? playlist.videoIds.indexOf(video.id) : -1;

  // Suggested: same category, different video
  const suggested = mockVideos
    .filter(v => v.id !== video.id && v.category === video.category)
    .slice(0, 6);
  const moreSuggested = suggested.length < 4
    ? mockVideos.filter(v => v.id !== video.id && !suggested.find(s => s.id === v.id)).slice(0, 6 - suggested.length)
    : [];
  const allSuggested = [...suggested, ...moreSuggested];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-4 md:py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player + Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Embed */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            </div>

            {/* Video Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-xl md:text-2xl font-bold">{video.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatViews(video.views)} views
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${
                      video.source === 'dailymotion' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                    }`}>
                      {video.source}
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 capitalize text-xs">
                      {video.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="shrink-0 flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm hover:bg-surface-hover transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{video.description}</p>
            </div>

            {/* Playlist queue on mobile */}
            {playlist && (
              <div className="lg:hidden">
                <PlaylistPanel
                  playlist={playlist}
                  videos={playlistVideos as any[]}
                  currentIndex={currentIndex}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Playlist on desktop */}
            {playlist && (
              <div className="hidden lg:block">
                <PlaylistPanel
                  playlist={playlist}
                  videos={playlistVideos as any[]}
                  currentIndex={currentIndex}
                />
              </div>
            )}

            {/* Suggested Videos */}
            <div>
              <h2 className="font-display text-base font-semibold mb-3">Suggested Videos</h2>
              <div className="space-y-3">
                {allSuggested.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function PlaylistPanel({ playlist, videos, currentIndex }: { playlist: any; videos: any[]; currentIndex: number }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <ListVideo className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">{playlist.title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Video {currentIndex + 1} of {videos.length}
      </p>
      {/* Progress */}
      <div className="w-full h-1 bg-secondary rounded-full mb-4">
        <div
          className="h-1 bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / videos.length) * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {videos.map((v: any, i: number) => (
          <Link
            key={v.id}
            to={`/watch/${v.id}`}
            className={`flex items-center gap-3 rounded-lg p-2 text-sm transition-colors ${
              i === currentIndex ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            <span className="shrink-0 w-5 text-center text-xs">{i + 1}</span>
            <span className="line-clamp-1">{v.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WatchPage;

import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { searchVideos } from '@/data/videos';
import { useState } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sourceFilter, setSourceFilter] = useState<string>('both');

  const results = searchVideos(query, sourceFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <h1 className="font-display text-xl md:text-2xl font-bold mb-1">
          Search results for "{query}"
        </h1>
        <p className="text-sm text-muted-foreground mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>

        {/* Source filter */}
        <div className="flex gap-2 mb-6">
          {['both', 'dailymotion', 'rumble'].map(f => (
            <button
              key={f}
              onClick={() => setSourceFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors capitalize ${
                sourceFilter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
              }`}
            >
              {f === 'both' ? 'All Sources' : f}
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {results.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No videos found. Try a different search term.</p>
        )}
      </main>
    </div>
  );
};

export default SearchPage;

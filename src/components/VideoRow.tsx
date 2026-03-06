import { VideoCard } from './VideoCard';
import { Video } from '@/data/videos';

interface VideoRowProps {
  title: string;
  icon?: string;
  videos: Video[];
}

export function VideoRow({ title, icon, videos }: VideoRowProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </section>
  );
}

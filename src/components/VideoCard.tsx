import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { Video, formatViews } from '@/data/videos';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: Video;
  index?: number;
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/watch/${video.id}`}
        className="group block rounded-xl overflow-hidden card-surface hover:ring-1 hover:ring-primary/30 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {video.duration}
          </div>
          {/* Source badge */}
          <div className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
            video.source === 'dailymotion' ? 'bg-blue-600/90 text-foreground' : 'bg-green-600/90 text-foreground'
          }`}>
            {video.source === 'dailymotion' ? 'DM' : 'Rumble'}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
              <svg className="h-5 w-5 fill-primary-foreground ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(video.views)}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 capitalize">
              {video.category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

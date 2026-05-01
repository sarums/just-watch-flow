import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { Video, formatViews } from '@/data/videos';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  video: Video;
}

export function HeroSection({ video }: HeroSectionProps) {
  return (
    <section className="relative -mx-4 md:mx-0 overflow-hidden md:rounded-2xl">
      {/* Background Image */}
      <div className="relative aspect-[16/10] md:aspect-[21/8]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {/* WeTV-style fades — bleed into pure black on all sides */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
            🔥 Featured
          </span>
          <h1 className="font-display text-2xl md:text-4xl font-bold leading-tight max-w-2xl">
            {video.title}
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl line-clamp-2">
            {video.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link
              to={`/watch/${video.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Now
            </Link>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              {formatViews(video.views)} views
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { Video, Playlist } from '@/types/video';

export const mockVideos: Video[] = [
  {
    id: 'v1',
    title: 'The Future of Space Exploration',
    description: 'A deep dive into upcoming missions to Mars and beyond.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=640&h=360&fit=crop',
    category: 'tech',
    duration: '12:34',
    views: 245000,
    addedAt: '2026-03-05',
    tags: ['space', 'mars', 'nasa'],
    featured: true,
  },
  {
    id: 'v2',
    title: 'Street Food Around the World',
    description: 'Exploring the most delicious street food from every continent.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2abc123/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=360&fit=crop',
    category: 'lifestyle',
    duration: '18:22',
    views: 189000,
    addedAt: '2026-03-04',
    tags: ['food', 'travel', 'culture'],
  },
  {
    id: 'v3',
    title: 'Championship Final Highlights',
    description: 'The most thrilling moments from the championship final.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0907?w=640&h=360&fit=crop',
    category: 'sports',
    duration: '8:45',
    views: 567000,
    addedAt: '2026-03-03',
    tags: ['sports', 'highlights', 'championship'],
  },
  {
    id: 'v4',
    title: 'Stand-Up Comedy Special: Live in NYC',
    description: 'A hilarious night of comedy from the best comedians in New York.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2def456/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=640&h=360&fit=crop',
    category: 'comedy',
    duration: '45:10',
    views: 412000,
    addedAt: '2026-03-02',
    tags: ['comedy', 'standup', 'live'],
  },
  {
    id: 'v5',
    title: 'Breaking: Global Climate Summit Results',
    description: 'Key takeaways from the latest international climate conference.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=640&h=360&fit=crop',
    category: 'news',
    duration: '6:12',
    views: 890000,
    addedAt: '2026-03-06',
    tags: ['news', 'climate', 'summit'],
  },
  {
    id: 'v6',
    title: 'Learn Piano in 30 Days — Day 1',
    description: 'Start your piano journey with this beginner-friendly tutorial.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2ghi789/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=640&h=360&fit=crop',
    category: 'education',
    duration: '22:08',
    views: 156000,
    addedAt: '2026-03-01',
    tags: ['piano', 'tutorial', 'beginner'],
    playlistId: 'pl1',
  },
  {
    id: 'v7',
    title: 'Learn Piano in 30 Days — Day 2',
    description: 'Continue your piano journey with chords and scales.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2jkl012/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=640&h=360&fit=crop',
    category: 'education',
    duration: '19:45',
    views: 98000,
    addedAt: '2026-03-01',
    tags: ['piano', 'tutorial', 'chords'],
    playlistId: 'pl1',
  },
  {
    id: 'v8',
    title: 'Epic Gaming Moments Compilation',
    description: 'The most insane plays and clutches from this month.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    category: 'gaming',
    duration: '15:33',
    views: 723000,
    addedAt: '2026-03-05',
    tags: ['gaming', 'compilation', 'esports'],
  },
  {
    id: 'v9',
    title: 'Acoustic Session: Indie Favorites',
    description: 'Chill acoustic covers of the best indie tracks this year.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2mno345/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop',
    category: 'music',
    duration: '32:15',
    views: 201000,
    addedAt: '2026-03-04',
    tags: ['music', 'acoustic', 'indie'],
  },
  {
    id: 'v10',
    title: 'Behind the Scenes: Movie Magic',
    description: 'How the biggest blockbusters create stunning visual effects.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=640&h=360&fit=crop',
    category: 'entertainment',
    duration: '28:40',
    views: 334000,
    addedAt: '2026-03-03',
    tags: ['movies', 'vfx', 'behind-scenes'],
  },
  {
    id: 'v11',
    title: 'AI Revolution: What Comes Next?',
    description: 'Expert predictions on how AI will transform every industry.',
    source: 'dailymotion',
    embedUrl: 'https://www.dailymotion.com/embed/video/x8ovmka',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop',
    category: 'tech',
    duration: '20:15',
    views: 1200000,
    addedAt: '2026-03-06',
    tags: ['ai', 'technology', 'future'],
    featured: true,
  },
  {
    id: 'v12',
    title: 'Morning Yoga Flow for Energy',
    description: 'Start your day right with this 15-minute energizing yoga sequence.',
    source: 'rumble',
    embedUrl: 'https://rumble.com/embed/v2pqr678/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=640&h=360&fit=crop',
    category: 'lifestyle',
    duration: '15:00',
    views: 445000,
    addedAt: '2026-03-02',
    tags: ['yoga', 'fitness', 'morning'],
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'pl1',
    title: 'Learn Piano in 30 Days',
    description: 'A complete beginner piano course.',
    videoIds: ['v6', 'v7'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=640&h=360&fit=crop',
    category: 'education',
  },
];

export function getVideoById(id: string): Video | undefined {
  return mockVideos.find(v => v.id === id);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return mockPlaylists.find(p => p.id === id);
}

export function getVideosByCategory(category: string): Video[] {
  return mockVideos.filter(v => v.category === category);
}

export function getFeaturedVideo(): Video {
  return mockVideos.find(v => v.featured) || mockVideos[0];
}

export function getTrendingVideos(): Video[] {
  return [...mockVideos].sort((a, b) => b.views - a.views).slice(0, 6);
}

export function getNewArrivals(): Video[] {
  return [...mockVideos].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 6);
}

export function searchVideos(query: string, sourceFilter?: string): Video[] {
  const q = query.toLowerCase();
  return mockVideos.filter(v => {
    const matchesQuery = v.title.toLowerCase().includes(q) || 
      v.tags.some(t => t.toLowerCase().includes(q)) ||
      v.description.toLowerCase().includes(q);
    const matchesSource = !sourceFilter || sourceFilter === 'both' || v.source === sourceFilter;
    return matchesQuery && matchesSource;
  });
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K`;
  return views.toString();
}

export type VideoSource = 'dailymotion' | 'rumble';

export type VideoCategory = 
  | 'news' | 'entertainment' | 'sports' | 'tech' 
  | 'music' | 'comedy' | 'education' | 'gaming' | 'lifestyle';

export interface Video {
  id: string;
  title: string;
  description: string;
  source: VideoSource;
  embedUrl: string;
  thumbnailUrl: string;
  category: VideoCategory;
  duration: string;
  views: number;
  addedAt: string;
  playlistId?: string;
  tags: string[];
  featured?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  videoIds: string[];
  thumbnailUrl: string;
  category: VideoCategory;
}

export const CATEGORIES: { value: VideoCategory; label: string; icon: string }[] = [
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'tech', label: 'Tech', icon: '💻' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'comedy', label: 'Comedy', icon: '😂' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '✨' },
];

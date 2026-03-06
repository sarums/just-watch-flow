import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoRow } from '@/components/VideoRow';
import { getVideosByCategory } from '@/data/videos';
import { CATEGORIES } from '@/types/video';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(c => c.value === slug);
  const videos = slug ? getVideosByCategory(slug) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        {category ? (
          <>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              {category.icon} {category.label}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {videos.length} video{videos.length !== 1 ? 's' : ''} in this category
            </p>
            {videos.length > 0 ? (
              <VideoRow title="" videos={videos} />
            ) : (
              <p className="text-muted-foreground py-12 text-center">No videos in this category yet.</p>
            )}
          </>
        ) : (
          <p className="text-center py-12 text-muted-foreground">Category not found.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;

export function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">All Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.value}
              to={`/category/${cat.value}`}
              className="rounded-xl bg-card border border-border p-6 text-center hover:border-primary/50 hover:bg-secondary transition-all group"
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <span className="font-display font-semibold group-hover:text-primary transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

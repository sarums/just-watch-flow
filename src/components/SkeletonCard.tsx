export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden card-surface">
      <div className="aspect-video bg-secondary animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 25%, hsl(var(--muted)) 50%, transparent 75%)' }} />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-secondary rounded w-3/4 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 25%, hsl(var(--muted)) 50%, transparent 75%)' }} />
        <div className="h-3 bg-secondary rounded w-1/2 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 25%, hsl(var(--muted)) 50%, transparent 75%)' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

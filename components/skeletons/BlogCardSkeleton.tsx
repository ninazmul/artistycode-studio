/**
 * Blog card grid skeleton — used as Suspense fallback for LatestBlogPosts
 * and the /blog listing page.
 */
export default function BlogCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl border border-white/5 overflow-hidden animate-pulse flex flex-col"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Image placeholder */}
          <div className="aspect-[16/9] bg-white/[0.04] border-b border-white/5" />

          {/* Content */}
          <div className="p-6 flex flex-col gap-3 flex-1">
            {/* Category badge */}
            <div className="w-20 h-3 bg-white/[0.06] rounded-full" />
            {/* Title */}
            <div className="h-5 bg-white/[0.07] rounded-lg w-full" />
            <div className="h-5 bg-white/[0.05] rounded-lg w-3/4" />
            {/* Excerpt */}
            <div className="h-3 bg-white/[0.04] rounded w-full mt-1" />
            <div className="h-3 bg-white/[0.04] rounded w-5/6" />
            <div className="h-3 bg-white/[0.04] rounded w-4/6" />
            {/* Footer */}
            <div className="pt-4 border-t border-white/5 flex justify-between mt-auto">
              <div className="w-24 h-3 bg-white/[0.04] rounded" />
              <div className="w-16 h-3 bg-white/[0.04] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Project card grid skeleton — used as Suspense fallback for
 * the /projects page and RecentProjects section.
 */
export default function ProjectCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl border border-white/5 overflow-hidden animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Image placeholder */}
          <div className="aspect-[16/10] bg-white/[0.04]" />

          {/* Content */}
          <div className="p-6 flex flex-col gap-3">
            {/* Category badge */}
            <div className="w-16 h-3 bg-white/[0.05] rounded-full" />
            {/* Title */}
            <div className="h-5 bg-white/[0.07] rounded-lg w-5/6" />
            {/* Description */}
            <div className="h-3 bg-white/[0.04] rounded w-full" />
            <div className="h-3 bg-white/[0.04] rounded w-4/6" />
            {/* Tags */}
            <div className="flex gap-2 mt-2">
              <div className="w-14 h-5 bg-white/[0.04] rounded-full" />
              <div className="w-16 h-5 bg-white/[0.04] rounded-full" />
              <div className="w-12 h-5 bg-white/[0.04] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

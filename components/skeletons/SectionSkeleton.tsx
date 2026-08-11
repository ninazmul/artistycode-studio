/**
 * Generic dark-theme animated skeleton block for section-level Suspense fallbacks.
 * Matches the site's glassmorphic aesthetic.
 */
export default function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <section className={`py-16 bg-black-100 ${height} relative overflow-hidden`}>
      <div className="wrapper">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="w-32 h-4 rounded-full bg-white/5 animate-pulse" />
          <div className="w-64 h-8 rounded-xl bg-white/5 animate-pulse" />
          <div className="w-48 h-4 rounded-full bg-white/[0.03] animate-pulse" />
        </div>
        {/* Content skeleton blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl border border-white/5 overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[16/9] bg-white/[0.04]" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-4 bg-white/[0.06] rounded-lg w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-full" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

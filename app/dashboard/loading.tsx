export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080808] px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/5 rounded-full" />
          <div className="h-8 w-48 bg-white/[0.07] rounded-xl" />
          <div className="h-4 w-80 bg-white/5 rounded-lg" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.05] bg-[#0d0d0d] p-5 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04]" />
              <div className="h-7 w-12 bg-white/[0.06] rounded-lg" />
              <div className="h-3 w-16 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl border border-white/[0.05] bg-[#0d0d0d] p-6 space-y-4">
          <div className="h-3 w-32 bg-white/[0.04] rounded" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.02] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

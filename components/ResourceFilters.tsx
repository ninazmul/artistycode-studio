"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const categories = [
  "All",
  "WebApps",
  "MobileApps",
  "Games",
  "WordPress",
  "CMS Themes",
  "UI Templates",
  "Other Scripts",
];

export default function ResourceFilters({ resources }: { resources: any[] }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const selectedType = searchParams.get("type") || "all";

  let filtered = resources;

  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (r: any) => r.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }
  if (selectedType === "free") {
    filtered = filtered.filter((r: any) => r.isFree);
  } else if (selectedType === "paid") {
    filtered = filtered.filter((r: any) => !r.isFree);
  }

  return (
    <div className="w-full">
      {/* Category Pills & Type Toggle */}
      <div className="flex flex-col items-center gap-5 mt-10 relative z-10 px-4 mb-16">
        <div className="flex justify-center gap-2 flex-wrap max-w-4xl">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Link
                key={cat}
                href={`/resources?category=${cat}&type=${selectedType}`}
                className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 uppercase ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                    : "glass border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/[0.05]"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Free / Paid toggle */}
        <div className="flex gap-1 p-1 rounded-full glass border border-white/10 bg-white/[0.02]">
          {["all", "free", "paid"].map((type) => {
            const isActive = selectedType === type;
            return (
              <Link
                key={type}
                href={`/resources?category=${selectedCategory}&type=${type}`}
                className={`px-6 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all uppercase ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {type}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-12 max-w-7xl mx-auto px-5 w-full">
        {filtered.map((r: any) => (
          <Link
            key={r._id}
            href={`/resources/${r._id}`}
            className="group block relative glass rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-500 ease-premium hover:-translate-y-2 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="relative overflow-hidden aspect-[16/10] bg-black-200 border-b border-white/10">
              <Image
                src={r.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={r.title || "Resource cover"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />

              {/* Price Badge */}
              <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-black italic tracking-wider text-shine">
                {r.isFree ? (
                  <span className="text-emerald-400">FREE</span>
                ) : (
                  <span>${r.price}</span>
                )}
              </div>

              {/* Category pill */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/70 uppercase tracking-widest">
                  {r.category}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black-100/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-6">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 line-clamp-1 group-hover:text-white transition-colors">
                {r.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/50 font-light line-clamp-2 leading-relaxed mb-5">
                {r.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">
                    {r.isFree ? "Open License" : "Commercial License"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                  <span className="uppercase tracking-widest text-[10px]">Get Code</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/40 text-sm italic">
            No code resources found matching your current filter.
          </p>
        </div>
      )}
    </div>
  );
}

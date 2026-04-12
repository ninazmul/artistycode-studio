"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <>
      {/* Filters */}
      <div className="flex flex-col items-center gap-6 mt-12 relative z-10 px-4 mb-20">
        <div className="flex justify-center gap-3 flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Link
                key={cat}
                href={`/resources?category=${cat}&type=${selectedType}`}
                className={`px-6 py-2 rounded-md text-[10px] font-bold tracking-[0.2em] border transition-all duration-500 uppercase ${
                  isActive
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "glass border-white/5 text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
        
        <div className="flex gap-4 p-1 glass rounded-md overflow-hidden border border-white/5">
          {["all", "free", "paid"].map((type) => {
            const isActive = selectedType === type;
            return (
              <Link
                key={type}
                href={`/resources?category=${selectedCategory}&type=${type}`}
                className={`px-8 py-2 rounded-md text-[10px] font-bold tracking-[0.2em] transition-all duration-500 uppercase ${
                  isActive
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/30 hover:text-white"
                }`}
              >
                {type}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16 max-w-7xl mx-auto px-5">
        {filtered.map((r: any) => (
          <Link
            key={r._id}
            href={`/resources/${r._id}`}
            className="group block relative glass rounded-2xl p-4 transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20 overflow-hidden"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/5 aspect-[4/3]">
              <Image
                src={r.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={r.title || "Resource cover"}
                fill
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110 group-hover:rotate-1"
              />
              {/* Price Badge */}
              <div className="absolute top-4 right-4 glass-dark px-4 py-2 text-[10px] font-black italic tracking-widest rounded-md border border-white/10 text-shine">
                {r.isFree ? "FREE" : `$${r.price}`}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="mt-6 px-4 pb-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold tracking-tight text-shine line-clamp-1 group-hover:text-white transition-colors">
                  {r.title}
                </h2>
                <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase bg-white/5 px-2 py-1 rounded">
                  {r.category}
                </span>
              </div>
              <p className="text-sm text-white/40 font-light line-clamp-2 leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                {r.description}
              </p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                <span className="text-[10px] items-center font-bold tracking-widest text-white/30 uppercase">
                  {r.isFree ? "OPEN SOURCE" : "PREMIUM ASSET"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="wrapper py-20">
          <p className="text-center text-white/30 font-light italic">
            No resources match your current enterprise filter.
          </p>
        </div>
      )}
    </>
  );
}

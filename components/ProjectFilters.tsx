"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const categories = ["All", "WebApps", "MobileApps", "Games"];

export default function ProjectFilters({ projects }: { projects: any[] }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const filtered =
    selectedCategory === "All"
      ? projects
      : projects.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <>
      {/* Filters */}
      <div className="flex justify-center gap-4 mt-12 flex-wrap relative z-10 px-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <Link
              key={cat}
              href={`/projects?category=${cat}`}
              className={`px-8 py-3 rounded-md text-xs font-bold tracking-[0.2em] border transition-all duration-500 uppercase ${
                isActive
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "glass border-white/5 text-white/40 hover:text-white hover:border-white/20 hover:scale-105"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-20 max-w-7xl mx-auto px-5">
        {filtered.map((p) => (
          <Link
            key={p._id}
            href={`/projects/${p._id}`}
            className="group block relative glass rounded-2xl p-4 transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20 overflow-hidden"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/5 aspect-[4/3]">
              <img
                src={p.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={p.title || "Project cover"}
                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110 group-hover:rotate-1"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="mt-6 px-4 pb-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold tracking-tight text-shine line-clamp-1 group-hover:text-white transition-colors">
                  {p.title}
                </h2>
                <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase bg-white/5 px-2 py-1 rounded">
                  {p.category}
                </span>
              </div>
              <p className="text-sm text-white/40 font-light line-clamp-2 leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                {p.description}
              </p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                <span className="text-[10px] items-center font-bold tracking-widest text-white/30 uppercase">
                  {p.stack}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

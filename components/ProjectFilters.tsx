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
      <div className="flex justify-center gap-3 mt-10 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/projects?category=${cat}`}
            className={`px-4 py-2 rounded-md text-sm border transition ${
              selectedCategory === cat
                ? "bg-white text-black border-white"
                : "border-white/20 text-white/60 hover:text-white"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-16 max-w-6xl mx-auto">
        {filtered.map((p) => (
          <Link
            key={p._id}
            href={`/projects/${p._id}`}
            className="group block border border-white/25 rounded-md overflow-hidden transition hover:shadow-lg p-4"
          >
            <div className="relative overflow-hidden rounded-md border border-white/10">
              <img
                src={p.image || "/assets/images/ArtistyCode Studio.jpg"}
                alt={p.title || "Project cover"}
                className="w-full h-[220px] object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-lg md:text-xl font-medium line-clamp-1">
                {p.title}
              </h2>
              <p className="text-sm text-white/50 line-clamp-2">
                {p.description}
              </p>
              <div className="flex items-center justify-between text-xs text-white/40 pt-2">
                <span>{p.stack}</span>
                <span>{p.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

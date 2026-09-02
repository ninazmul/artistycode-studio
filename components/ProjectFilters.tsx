"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const categories = ["All", "WebApps", "MobileApps", "Games"];

export default function ProjectFilters({ projects }: { projects: any[] }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const filtered =
    selectedCategory === "All"
      ? projects
      : projects.filter(
          (p: any) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <>
      {/* Filters Pill Bar */}
      <div className="flex justify-center gap-2.5 mt-10 flex-wrap relative z-10 px-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <Link
              key={cat}
              href={`/projects?category=${cat}`}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 uppercase ${
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

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16 max-w-7xl mx-auto px-5 w-full">
        {filtered.map((p: any, index: number) => {
          const stackList = p.stack
            ? p.stack.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];

          return (
            <Link
              key={p._id}
              href={`/projects/${p._id}`}
              className="group block relative glass rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-500 ease-premium hover:-translate-y-2 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Image Viewport */}
              <div className="relative overflow-hidden aspect-[16/10] bg-black-200 border-b border-white/10">
                <Image
                  src={p.image || "/assets/images/ArtistyCode Studio.jpg"}
                  alt={p.title || "Project cover"}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white/80 uppercase tracking-widest">
                    {p.category}
                  </span>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black-100/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight text-white mb-2 line-clamp-1 group-hover:text-white transition-colors">
                  {p.title}
                </h2>

                <p className="text-xs sm:text-sm text-white/50 font-light line-clamp-2 leading-relaxed mb-5">
                  {p.description}
                </p>

                {/* Tech Tags */}
                {stackList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {stackList.slice(0, 3).map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                    Production Architecture
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/40 group-hover:text-white transition-colors duration-300">
                    <span className="uppercase tracking-widest text-[10px]">Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/40 text-sm italic">No projects found in this category.</p>
        </div>
      )}
    </>
  );
}

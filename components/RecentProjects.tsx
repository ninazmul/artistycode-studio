"use client";

import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import MagicButton from "./MagicButton";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const RecentProjects = ({ projects }: { projects: any[] }) => {
  const categories = {
    WebApps: projects?.filter((p: any) => p.category === "WebApps") || [],
    MobileApps: projects?.filter((p: any) => p.category === "MobileApps") || [],
    Games: projects?.filter((p: any) => p.category === "Games") || [],
  };

  const interleavedProjects: any[] = [];
  const maxLength = Math.max(
    categories.WebApps.length,
    categories.MobileApps.length,
    categories.Games.length,
  );

  for (let i = 0; i < maxLength; i++) {
    if (categories.WebApps[i]) interleavedProjects.push(categories.WebApps[i]);
    if (categories.MobileApps[i]) interleavedProjects.push(categories.MobileApps[i]);
    if (categories.Games[i]) interleavedProjects.push(categories.Games[i]);
  }

  const displayedProjects = interleavedProjects.slice(0, 9);

  return (
    <section id="projects" className="py-28 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[60%] lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <p className="uppercase tracking-[0.28em] text-[10px] font-semibold text-white/60">
                CURATED PORTFOLIO
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-shine italic text-left leading-[1.1]">
              SELECTED<br />SYSTEMS & WORK
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-white/50 max-w-sm text-sm sm:text-base font-light leading-relaxed md:text-right">
              Enterprise-grade solutions built with precision, performance, and design excellence.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors duration-300 group"
            >
              <span>Explore All Products</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayedProjects.map((item: any, index: number) => {
            const stackList = item.stack
              ? item.stack.split(",").map((s: string) => s.trim()).filter(Boolean)
              : [];

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={`/projects/${item._id}`}
                  className="group block rounded-2xl glass border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/[0.04] shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                >
                  {/* Image Viewport */}
                  <div className="relative overflow-hidden aspect-[16/9] border-b border-white/10 bg-black-200">
                    <Image
                      src={item.image || "/assets/images/ArtistyCode Studio.jpg"}
                      alt={item.title || "Project"}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
                    />

                    {/* Top index badge */}
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center">
                      <span className="text-[10px] font-mono font-bold text-white/70">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white/80 uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>

                    {/* Hover gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black-100/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white group-hover:text-white transition-colors duration-300 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light line-clamp-2 mb-5">
                      {item.description}
                    </p>

                    {/* Tech stack chips */}
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

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                        Production Live
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white/40 group-hover:text-white transition-colors duration-300">
                        <span className="uppercase tracking-widest text-[10px]">Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-16">
          <Link href="/projects">
            <MagicButton
              title="View All Projects"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentProjects;

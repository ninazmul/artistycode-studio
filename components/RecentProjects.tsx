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
    <section id="projects" className="py-24 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[60%] lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
              <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/50">
                CURATED PORTFOLIO
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-shine italic text-left">
              SELECTED<br />WORK
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-white/40 max-w-sm text-base font-light leading-relaxed md:text-right">
              Enterprise-grade solutions built with precision, performance, and design excellence.
            </p>
            <Link href="/projects">
              <button className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors duration-300 group">
                View All Projects
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((item: any, index: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/projects/${item._id}`}
                className="group block glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.03]"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] border-b border-white/5">
                  <Image
                    src={item.image || "/assets/images/ArtistyCode Studio.jpg"}
                    alt={item.title || "Project"}
                    fill
                    priority={index < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
                  />
                  {/* Index overlay */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <span className="text-[11px] font-black text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Category pill */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black-100/90 via-black-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2 group-hover:text-white transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light line-clamp-2 mb-5">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/25 truncate max-w-[60%]">
                      {item.stack}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white/30 group-hover:text-white transition-colors duration-300">
                      <span className="uppercase tracking-widest">Case Study</span>
                      <FaLocationArrow className="text-[10px] -rotate-45" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA — always visible */}
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

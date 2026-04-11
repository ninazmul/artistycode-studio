"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Code, Layout } from "lucide-react";
import { ZoomIn } from "lucide-react"; // zoom icon

type ProjectHeroProps = {
  image: string;
  title: string;
  stack: string;
  category: string;
};

const ProjectHero = ({ image, title, stack, category }: ProjectHeroProps) => {
  return (
    <div className="relative w-full rounded-[3.5rem] overflow-hidden glass p-4 group">
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden">
        <Image
          src={image}
          alt={title || "Project Hero Image"}
          width={1920}
          height={1080}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          priority
        />
        
        {/* Subtle Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black-100 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Floating Glass */}
      <div className="mt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-6 pb-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter text-shine mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 px-5 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase text-white/50 border border-white/5 whitespace-nowrap">
              <Code size={14} className="text-white/30" /> {stack}
            </span>
            <span className="flex items-center gap-2 px-5 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase text-white/50 border border-white/5 whitespace-nowrap">
              <Layout size={14} className="text-white/30" /> {category}
            </span>
          </div>
        </div>

        {/* Zoom Button */}
        <div className="flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-3 px-6 py-4 glass-dark text-white rounded-full hover:bg-white hover:text-black transition-all duration-500 font-bold text-sm border border-white/10 group/btn">
                <ZoomIn size={18} className="group-hover/btn:scale-110 transition-transform" /> 
                <span className="tracking-tight">ENLARGE VIEW</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black-100/90 backdrop-blur-2xl p-0 max-w-7xl border-white/10 overflow-hidden rounded-[3rem]">
              <div className="relative w-full h-[80vh]">
                <Image
                  src={image}
                  alt={title || "Full Project Image"}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;

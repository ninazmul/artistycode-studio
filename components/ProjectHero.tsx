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
    <div className="relative w-full rounded-md overflow-hidden shadow-xl">
      <Image
        src={image}
        alt={title || "Project Hero Image"}
        width={1920}
        height={1080}
        className="w-full h-auto object-top object-contain transition-transform duration-500 hover:scale-105 rounded-md"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-md flex flex-col justify-end px-6 md:px-12 py-10">
        <h1 className="text-xl md:text-5xl font-bold">{title}</h1>
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full text-sm font-semibold bg-black/30 backdrop-blur-sm">
            {stack} <Code size={16} />
          </span>
          <span className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full text-sm font-semibold bg-black/30 backdrop-blur-sm">
            {category} <Layout size={16} />
          </span>
        </div>

        {/* Zoom Button */}
        <div className="absolute bottom-2 md:bottom-6 right-2 md:right-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition">
                <ZoomIn size={20} />{" "}
                <span className="hidden md:block">Zoom</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black p-0 max-w-5xl">
              <Image
                src={image}
                alt={title || "Full Project Image"}
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;

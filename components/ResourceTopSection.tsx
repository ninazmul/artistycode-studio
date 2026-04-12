"use client";

import Image from "next/image";
import Link from "next/link";
import { Code, Layout } from "lucide-react";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import Checkout from "./Checkout";

interface ResourceTopProps {
  resource: any;
}

const ResourceTopSection = ({ resource }: ResourceTopProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
      {/* Image Container */}
      <div className="relative w-full lg:w-1/2 glass p-4 rounded-2xl overflow-hidden group">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-100 via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* Info Content */}
      <div className="flex-1 w-full space-y-8 lg:pt-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md glass border border-white/5">
            <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-white/40">
              {resource.category}
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-shine">
            {resource.title}
          </h1>
          <div className="text-2xl md:text-3xl font-black italic text-white/90">
            {resource.isFree ? "FREE" : `$${resource.price}`}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 px-5 py-2 glass rounded-md text-xs font-bold tracking-widest uppercase text-white/50 border border-white/5 whitespace-nowrap">
            <Code size={14} className="text-white/30" /> {resource.stack}
          </span>
          <span className="flex items-center gap-2 px-5 py-2 glass rounded-md text-xs font-bold tracking-widest uppercase text-white/50 border border-white/5 whitespace-nowrap">
            <Layout size={14} className="text-white/30" /> {resource.category}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/5 items-center">
          {resource.url && (
            <Link href={resource.url} target="_blank" className="w-full sm:w-auto">
              <MagicButton
                title="View Live Demo"
                icon={<FaLocationArrow />}
                position="right"
                otherClasses="w-full"
              />
            </Link>
          )}
          <div className="w-full sm:w-auto">
            <Checkout resource={resource} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTopSection;

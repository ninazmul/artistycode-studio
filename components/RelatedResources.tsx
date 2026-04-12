"use client";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "lucide-react";

interface RelatedProps {
  items: any[];
}

const RelatedResources = ({ items }: RelatedProps) => (
  <div className="space-y-12">
    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-shine">RELATED RESOURCES</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <Link
          key={item._id}
          href={`/resources/${item._id}`}
          className="group block relative glass rounded-2xl p-4 transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20 overflow-hidden"
        >
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/5">
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Price Badge */}
            <div className="absolute top-4 right-4 glass-dark px-4 py-2 text-[10px] font-black italic tracking-widest rounded-md border border-white/10 text-shine">
              {item.isFree ? "FREE" : `$${item.price}`}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="mt-6 px-4 pb-4">
            <div className="flex justify-between items-start mb-3 text-shine">
              <h3 className="text-base font-bold tracking-tight line-clamp-1 group-hover:text-white transition-colors">
                {item.title}
              </h3>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                {item.category}
              </span>
              <Layout size={14} className="text-white/20" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default RelatedResources;

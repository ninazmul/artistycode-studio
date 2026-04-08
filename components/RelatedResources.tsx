"use client";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "lucide-react";

interface RelatedProps {
  items: any[];
}

const RelatedResources = ({ items }: RelatedProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold">Related Resources</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link
          key={item._id}
          href={`/resources/${item._id}`}
          className="group block border border-white/25 rounded-xl overflow-hidden bg-black-200 hover:shadow-xl transition-all duration-300"
        >
          <div className="relative w-full h-52 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-3 py-1 text-xs rounded-md border border-white/20">
              {item.isFree ? "Free" : `$${item.price}`}
            </div>
          </div>

          <div className="p-5 flex flex-col justify-between h-[calc(100%-13rem)]">
            <h3 className="font-semibold text-lg lg:text-xl line-clamp-2 mb-4">
              {item.title}
            </h3>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-white">
                {item.isFree ? "Free" : `$${item.price}`}
              </span>
              <span className="flex items-center gap-2">
                <span className="capitalize">{item.category}</span>
                <Layout size={16} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default RelatedResources;

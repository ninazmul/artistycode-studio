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
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="relative w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={resource.image}
          alt={resource.title}
          width={1920}
          height={1080}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex-1 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">{resource.title}</h1>
        <div className="text-2xl font-bold">
          {resource.isFree ? "Free" : `$${resource.price}`}
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium">
            {resource.stack} <Code size={16} />
          </span>
          <span className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium">
            {resource.category} <Layout size={16} />
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {resource.url && (
            <Link href={resource.url} target="_blank">
              <MagicButton
                title="Demo"
                icon={<FaLocationArrow />}
                position="right"
              />
            </Link>
          )}
          <Checkout resource={resource} />
        </div>
      </div>
    </div>
  );
};

export default ResourceTopSection;

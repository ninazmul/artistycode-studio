"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAllReviews } from "@/lib/actions/review.actions";

const Page = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        const verifiedReviews = data.filter((review: any) => review.verified);
        setReviews(verifiedReviews);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="py-20 bg-black-100 px-4 md:px-10">
      <h1 className="heading text-center">
        Hear From <span className="text-purple">Our Clients</span>
      </h1>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Masonry layout using CSS columns */}
      <div className="w-full mt-10 space-y-6">
        {loading && !error ? (
          <div className="space-y-8 w-full">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          reviews.map((item, idx) => (
            <div
              key={idx}
              className="break-inside-avoid rounded-2xl border border-slate-800 p-6 hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              }}
            >
              <blockquote>
                <p className="text-sm md:text-base text-white text-justify">
                  {item.quote}
                </p>
                <div className="mt-4 flex items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-base font-bold text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-white-200">{item.title}</p>
                  </div>
                </div>
              </blockquote>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div
    className="animate-pulse rounded-2xl border border-slate-800 p-6 w-full"
    style={{
      backgroundImage:
        "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
    }}
  >
    <div className="space-y-4">
      <div className="h-4 bg-black-200 rounded w-full" />
      <div className="h-4 bg-black-200 rounded w-5/6" />
      <div className="h-4 bg-black-200 rounded w-3/4" />
      <div className="h-4 bg-black-200 rounded w-2/3" />
    </div>

    <div className="mt-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-black-200" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-black-200 rounded" />
        <div className="h-3 w-16 bg-black-200 rounded" />
      </div>
    </div>
  </div>
);

export default Page;

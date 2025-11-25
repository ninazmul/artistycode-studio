"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/InfiniteCards";
import { getAllReviews } from "@/lib/actions/review.actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import ReviewForm from "@/app/dashboard/components/ReviewForm";
import MagicButton from "./MagicButton";
import { Star } from "lucide-react";
import Link from "next/link";

const Clients = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data: any = await getAllReviews();
        const verifiedReviews = data.filter((review: any) => review.verified);
        setReviews(verifiedReviews);
      } catch (err) {
        setError("Failed to load reviews");
      }
    };

    fetchReviews();
  }, []);
  return (
    <section id="testimonials" className="py-10">
      <h1 className="heading mb-4">
        Kind words from
        <span className="text-purple"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <Link
          href="/testimonials"
          // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
          className="h-full rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={reviews}
            direction="right"
            speed="fast"
            className={undefined}
          />
        </Link>

        <div className="my-10">
          <Sheet>
            <SheetTrigger>
              <MagicButton
                title="Leave a Review"
                icon={<Star />}
                position="right"
              />
            </SheetTrigger>

            <SheetContent className="backdrop-blur-md shadow-md">
              <SheetHeader>
                <SheetTitle>Share Your Experience</SheetTitle>
                <SheetDescription>
                  We’d love to hear your feedback! Please take a moment to share
                  your thoughts and help us improve.
                </SheetDescription>
              </SheetHeader>
              <div className="py-5">
                <ReviewForm type="Create" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export default Clients;

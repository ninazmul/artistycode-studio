"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Clients = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  // Fetch reviews once
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        setReviews(data.filter((r: any) => r.verified));
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // Auto slide
  useEffect(() => {
    if (!reviews.length) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      5000, // slightly slower for readability
    );
    return () => clearInterval(interval);
  }, [reviews]);

  const currentReview = reviews[index];

  return (
    <section id="testimonials" className="py-20 bg-black text-white px-6">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">Client Feedback</h1>
        <p className="text-white/60 mt-3 text-sm">
          Real experiences from real clients.
        </p>
      </div>

      {/* Slider */}
      <div className="mt-16 mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {currentReview && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border border-white/10 rounded-md p-6 bg-white/5"
            >
              {/* Profile */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={
                      currentReview.image || "/assets/images/default-avatar.png"
                    }
                    alt={currentReview.name || "Client avatar"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{currentReview.name}</p>
                  <p className="text-xs text-white/50">{currentReview.title}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3 text-white/80">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill="white"
                    stroke="white"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-white/70 leading-relaxed">
                “{currentReview.quote}”
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-16">
        <Sheet>
          <SheetTrigger asChild>
            <MagicButton
              title="Leave a Review"
              icon={<Star />}
              position="right"
            />
          </SheetTrigger>

          <SheetContent className="bg-black text-white border-l border-white/10">
            <SheetHeader>
              <SheetTitle>Share Your Experience</SheetTitle>
              <SheetDescription className="text-white/60">
                Your feedback helps us grow.
              </SheetDescription>
            </SheetHeader>

            <div className="py-6">
              <ReviewForm type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default Clients;

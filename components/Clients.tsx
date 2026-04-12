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
    <section id="testimonials" className="py-32 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full lighting-radial opacity-20 pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-24">
        <h2 className="heading mb-6 tracking-tighter uppercase italic">CLIENT FEEDBACK</h2>
        <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
          Voices of partnership. We take pride in the transformative digital systems 
          we build alongside our global clients.
        </p>
      </div>

      {/* Slider */}
      <div className="wrapper relative z-10 mx-auto max-w-4xl overflow-hidden px-4">
        <AnimatePresence mode="wait">
          {currentReview && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-10 md:p-16 flex flex-col items-center text-center"
            >
              {/* Profile */}
              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-white/5">
                  <Image
                    src={
                      currentReview.image || "/assets/images/default-avatar.png"
                    }
                    alt={currentReview.name || "Client avatar"}
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-tight">{currentReview.name}</h4>
                  <p className="text-sm text-white/40 uppercase tracking-widest font-semibold mt-1">{currentReview.title}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-2 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-white fill-white/80"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-2xl font-light italic leading-snug text-white/90 max-w-2xl">
                &ldquo;{currentReview.quote}&rdquo;
              </blockquote>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-20 relative z-10">
        <Sheet>
          <SheetTrigger asChild>
            <MagicButton
              title="Leave a Review"
              icon={<Star className="w-4 h-4" />}
              position="right"
            />
          </SheetTrigger>

          <SheetContent className="glass-dark border-l border-white/10 text-white pt-20">
            <SheetHeader className="mb-10">
              <SheetTitle className="text-3xl font-black italic text-shine">SHARE YOUR EXPERIENCE</SheetTitle>
              <SheetDescription className="text-white/40 font-light text-base">
                Your partnership fuels our innovation. We value your honest feedback.
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

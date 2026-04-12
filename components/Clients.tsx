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
    <section id="testimonials" className="py-20 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full lighting-radial opacity-20 pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md glass border border-white/5 mb-8">
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
            ENGINEERING EXCELLENCE
          </p>
        </div>
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
              className="glass rounded-2xl p-10 md:p-20 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute top-10 left-10 text-9xl font-serif text-white/[0.03] pointer-events-none">
                &ldquo;
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center gap-6 mb-12 relative z-10">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 p-1.5 glass bg-white/[0.02] shadow-inner-glow transform rotate-3">
                  <Image
                    src={
                      currentReview.image || "/assets/images/default-avatar.png"
                    }
                    alt={currentReview.name || "Client avatar"}
                    width={96}
                    height={96}
                    className="rounded-xl object-cover w-full h-full grayscale brightness-110 transition-all duration-700 -rotate-3 hover:rotate-0 hover:grayscale-0"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold tracking-tight">{currentReview.name}</h4>
                  <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-semibold mt-1 italic">
                    {currentReview.title}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1.5 mb-12">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-white fill-white/10 stroke-white/20"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-2xl font-light italic leading-relaxed text-white/80 max-w-2xl relative z-10">
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

          <SheetContent className="glass-dark border-l border-white/5 text-white pt-20">
            <SheetHeader className="mb-10 text-center sm:text-left">
              <SheetTitle className="text-3xl font-black italic text-shine tracking-tighter">SHARE YOUR EXPERIENCE</SheetTitle>
              <SheetDescription className="text-white/40 font-light text-base leading-relaxed">
                Your partnership fuels our innovation. We value your honest feedback 
                on our technical collaboration.
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

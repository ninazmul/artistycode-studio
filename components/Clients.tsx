"use client";

import React, { useEffect, useState } from "react";
import { getAllReviews } from "@/lib/actions/review.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ReviewForm from "@/app/dashboard/components/ReviewForm";
import MagicButton from "./MagicButton";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Clients = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (!reviews.length) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      6000,
    );
    return () => clearInterval(interval);
  }, [reviews]);

  const currentReview = reviews[index];

  return (
    <section id="testimonials" className="py-24 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/50">
              CLIENT VOICES
            </p>
          </div>
          <h2 className="heading italic mb-6">WHAT CLIENTS SAY</h2>
          <p className="text-white/40 max-w-xl mx-auto text-base font-light leading-relaxed">
            Voices of partnership. We measure success by our clients&apos; outcomes.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentReview && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="glass rounded-2xl p-8 md:p-14 border border-white/10 relative overflow-hidden">
                  {/* Top shimmer */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  {/* Giant quote mark */}
                  <Quote className="absolute top-8 right-8 w-20 h-20 text-white/[0.03] rotate-180" />

                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-white/60 text-white/60"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed text-white/80 mb-10 relative z-10">
                    &ldquo;{currentReview.quote}&rdquo;
                  </blockquote>

                  {/* Divider */}
                  <div className="w-12 h-px bg-white/15 mb-8" />

                  {/* Profile */}
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/15 p-1 glass bg-white/[0.02] shrink-0">
                      <Image
                        src={currentReview.image || "/assets/images/default-avatar.png"}
                        alt={currentReview.name || "Client"}
                        width={56}
                        height={56}
                        className="rounded-xl object-cover w-full h-full grayscale brightness-110"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold tracking-tight">
                        {currentReview.name}
                      </h4>
                      <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-semibold mt-0.5">
                        {currentReview.title}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dot pagination */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`rounded-full transition-all duration-400 ${
                    i === index
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <Dialog>
            <DialogTrigger asChild>
              <MagicButton
                title="Leave a Review"
                icon={<Star className="w-4 h-4" />}
                position="right"
              />
            </DialogTrigger>
            <DialogContent className="glass-dark border border-white/10 text-white max-w-lg w-full">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-black italic text-shine tracking-tighter">
                  SHARE YOUR EXPERIENCE
                </DialogTitle>
                <DialogDescription className="text-white/40 font-light text-base leading-relaxed">
                  Your partnership fuels our innovation. We value your honest feedback.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ReviewForm type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Clients;

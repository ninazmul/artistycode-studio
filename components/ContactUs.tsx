"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import MagicButton from "./MagicButton";
import {
  FaLocationArrow,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { Mail, Clock, ShieldCheck, CheckCircle2, ArrowUpRight } from "lucide-react";
import { HOSTINGER_PARTNER } from "@/constants";

export const socialMedia = [
  {
    id: 1,
    name: "LinkedIn",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/artistycode-studio",
  },
  {
    id: 2,
    name: "Facebook",
    icon: <FaFacebook />,
    link: "https://www.facebook.com/ArtistyCodeStudio",
  },
];

const serviceOptions = [
  "Enterprise Web App",
  "Mobile App (iOS & Android)",
  "AI Agents & Automation",
  "Cloud Architecture & DevOps",
  "UI/UX Design System",
  "Full-Stack Consultation",
];

const budgetRanges = [
  "< $5,000",
  "$5,000 - $15,000",
  "$15,000 - $30,000",
  "$30,000+",
];

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    selectedService: "Enterprise Web App",
    selectedBudget: "$5,000 - $15,000",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      phone: formData.phone,
      message: `[Service: ${formData.selectedService}] [Budget: ${formData.selectedBudget}]\n\n${formData.message}`,
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Consultation request sent! We'll reply within 12 hours.");
        setFormData({
          user_name: "",
          user_email: "",
          phone: "",
          selectedService: "Enterprise Web App",
          selectedBudget: "$5,000 - $15,000",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please reach out via WhatsApp.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Studio Details & Direct Channels */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="uppercase tracking-[0.25em] text-[10px] font-semibold text-white/60">
              DIRECT ACCESS
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight text-shine">
            START YOUR <br />PARTNERSHIP
          </h2>
          <p className="text-white/50 mt-4 text-sm sm:text-base font-light leading-relaxed">
            Tell us about your product vision, timeline, and goals. Our engineering leads evaluate your requirements and deliver a structured roadmap.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl glass border border-white/5 bg-white/[0.02]">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-white/70">Response Time: Under 12 Hours SLA</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl glass border border-white/5 bg-white/[0.02]">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs text-white/70">Strict NDA & IP Protection Guaranteed</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl glass border border-white/5 bg-white/[0.02]">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs text-white/70">Direct Access to Senior System Architects</span>
          </div>
        </div>

        {/* Direct Channels */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <a
            href="https://wa.me/8801580845746?text=Hello%20ArtistyCode%20Studio,%20I%20am%20reaching%20out%20via%20your%20official%20website.%20Please%20assist%20me%20with%20my%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl glass border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FaWhatsapp className="text-lg" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Instant WhatsApp Chat</span>
                <span className="text-[11px] text-white/40">+880 1580-845746</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href="mailto:contact@artistycode.studio"
            className="flex items-center justify-between p-4 rounded-xl glass border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Official Studio Email</span>
                <span className="text-[11px] text-white/40">contact@artistycode.studio</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Social media links */}
        <div className="flex items-center gap-3">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/10 hover:border-white/30 hover:bg-white/[0.06] transition text-white/50 hover:text-white"
              title={item.name}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right Column: Luxury Form */}
      <div className="lg:col-span-7 rounded-3xl glass-premium p-8 sm:p-10 border border-white/15 relative overflow-hidden shadow-2xl">
        {/* Top highlight line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service interest selection */}
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-2.5">
              Service of Interest
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {serviceOptions.map((srv) => (
                <button
                  type="button"
                  key={srv}
                  onClick={() => setFormData({ ...formData, selectedService: srv })}
                  className={`p-2.5 rounded-xl border text-left text-[11px] font-medium transition-all ${
                    formData.selectedService === srv
                      ? "bg-white text-black border-white shadow-md font-bold"
                      : "glass border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-2.5">
              Estimated Budget
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {budgetRanges.map((bgt) => (
                <button
                  type="button"
                  key={bgt}
                  onClick={() => setFormData({ ...formData, selectedBudget: bgt })}
                  className={`p-2.5 rounded-xl border text-center text-[11px] font-medium transition-all ${
                    formData.selectedBudget === bgt
                      ? "bg-white text-black border-white shadow-md font-bold"
                      : "glass border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                >
                  {bgt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
                Your Name *
              </label>
              <input
                name="user_name"
                placeholder="e.g. Alex Morgan"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full bg-black-200/80 border border-white/15 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                name="user_email"
                placeholder="alex@company.com"
                value={formData.user_email}
                onChange={handleChange}
                required
                className="w-full bg-black-200/80 border border-white/15 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
              Phone / WhatsApp (optional)
            </label>
            <input
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-black-200/80 border border-white/15 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
              Project Vision & Scope *
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Describe your product idea, key features, target timeline, or existing stack..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full bg-black-200/80 border border-white/15 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full sm:w-auto">
              <MagicButton
                title={loading ? "Transmitting..." : "Submit Consultation Request"}
                icon={<FaLocationArrow />}
                position="right"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

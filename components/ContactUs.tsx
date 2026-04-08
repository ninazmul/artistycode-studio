"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import MagicButton from "./MagicButton";
import {
  FaLocationArrow,
  FaGithub,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

export const socialMedia = [
  {
    id: 1,
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/artistycode-studio",
  },
  {
    id: 2,
    icon: <FaFacebook />,
    link: "https://www.facebook.com/ArtistyCodeStudio",
  },
];

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent!");
        setFormData({
          user_name: "",
          user_email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Failed to send.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
      {/* Left: Info */}
      <div>
        <h2 className="text-2xl font-semibold">Start a Project</h2>
        <p className="text-white/60 mt-4 text-sm">
          Tell us about your idea, goals, and timeline. We’ll get back with a
          clear plan and next steps.
        </p>

        <div className="flex items-center gap-4 md:gap-3 mt-6">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-md border border-white/20 hover:bg-white/10 transition"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="user_name"
          placeholder="Your Name"
          value={formData.user_name}
          onChange={handleChange}
          required
          className="w-full bg-black border border-white/10 px-4 py-3 rounded-lg text-sm"
        />

        <input
          type="email"
          name="user_email"
          placeholder="Email Address"
          value={formData.user_email}
          onChange={handleChange}
          required
          className="w-full bg-black border border-white/10 px-4 py-3 rounded-lg text-sm"
        />

        <input
          name="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 px-4 py-3 rounded-lg text-sm"
        />

        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your project..."
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full bg-black border border-white/10 px-4 py-3 rounded-lg text-sm"
        />

        <button type="submit">
          <MagicButton
            title={loading ? "Sending..." : "Start Project"}
            icon={<FaLocationArrow />}
            position="right"
          />
        </button>
      </form>
    </div>
  );
};

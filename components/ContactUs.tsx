"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MagicButton from "./MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

import {
  FaGithub,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

export const socialMedia = [
  {
    id: 1,
    icon: <FaGithub />,
    link: "https://github.com/ninazmul",
  },
  {
    id: 2,
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/106677264",
  },
  {
    id: 3,
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
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("SUCCESS");
        toast.success("Message sent successfully!");
        setFormData({ user_name: "", user_email: "", phone: "", message: "" });
      } else {
        setStatus("FAILED");
        toast.error("Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("FAILED");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Contact Us
        </h2>

        {!status && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Please feel free to reach out with any ideas, questions, or
            collaboration proposals.
          </p>
        )}
        {status === "SUCCESS" && (
          <p className="text-green-600 font-semibold mb-6">
            Message sent successfully!
          </p>
        )}
        {status === "FAILED" && (
          <p className="text-red-500 font-semibold mb-6">
            Message failed to send. Please try again.
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          {/* Social Icons */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Follow us on:
            </h3>
            <div className="flex items-center md:gap-3 gap-6">
              {socialMedia.map((info) => (
                <a
                  key={info.id}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
                >
                  {info.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="user_name"
                  className="text-gray-800 dark:text-gray-200 block text-sm font-medium mb-1"
                >
                  Name
                </Label>
                <Input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="John Doe"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black-100 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="user_email"
                  className="text-gray-800 dark:text-gray-200 block text-sm font-medium mb-1"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="you@example.com"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black-100 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-gray-800 dark:text-gray-200 block text-sm font-medium mb-1"
                >
                  Phone
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+880 1XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black-100 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="message"
                  className="text-gray-800 dark:text-gray-200 block text-sm font-medium mb-1"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black-100 text-gray-900 dark:text-white"
                />
              </div>
              <button type="submit">
                <MagicButton
                  title={loading ? "Sending..." : "Send Message"}
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

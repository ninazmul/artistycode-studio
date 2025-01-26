"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ImFacebook, ImInstagram, ImLinkedin, ImTwitter } from "react-icons/im";
import toast from "react-hot-toast";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/MovingBorders";

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
    <div className="flex items-center justify-center">
      <Card className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Form</h2>
        {!status && (
          <p className="text-gray-600 text-sm mb-6">
            Please feel free to contact us to share your ideas, suggestions, or
            any queries.
          </p>
        )}
        {status === "SUCCESS" && (
          <p className="text-green-600 font-medium mb-6">
            Message sent successfully!
          </p>
        )}
        {status === "FAILED" && (
          <p className="text-red-600 font-medium mb-6">
            Message failed to send. Please try again.
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <h3 className="font-semibold">Follow us on:</h3>
            <div className="flex items-center gap-4 py-4">
              <Link href={"/"} target="_blank">
                <ImFacebook className="size-10 bg-primary-500 p-2 rounded-md text-white hover:text-black shadow hover:bg-yellow-400 transition-colors" />
              </Link>
              <Link href={"/"} target="_blank">
                <ImInstagram className="size-10 bg-primary-500 p-2 rounded-md text-white hover:text-black shadow hover:bg-yellow-400 transition-colors" />
              </Link>
              <Link href={"/"} target="_blank">
                <ImTwitter className="size-10 bg-primary-500 p-2 rounded-md text-white hover:text-black shadow hover:bg-yellow-400 transition-colors" />
              </Link>
              <Link href={"/"} target="_blank">
                <ImLinkedin className="size-10 bg-primary-500 p-2 rounded-md text-white hover:text-black shadow hover:bg-yellow-400 transition-colors" />
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="user_name"
                  className="block text-sm font-medium"
                >
                  Name
                </Label>
                <Input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="user_email"
                  className="block text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="Your email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium">
                  Phone
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={loading} // Disable button when loading
                className={`w-full font-medium py-2 ${
                  loading
                    ? "bg-primary-500 text-white bg-muted-foreground"
                    : "bg-primary-500 text-white"
                }`}
              >
                {loading ? "Sending..." : "Send"} {/* Show loading text */}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

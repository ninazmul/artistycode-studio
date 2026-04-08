"use client";

import React, { useState } from "react";
import { createOrder } from "@/lib/actions/order.actions";
import toast from "react-hot-toast";
import { IResource } from "@/lib/database/models/resource.model";
import MagicButton from "./MagicButton";
import { DollarSign } from "lucide-react";
import PaymentOptions from "./PaymentOptions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

const Checkout = ({ resource }: { resource: IResource }) => {
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerNumber, setBuyerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onCheckout = async () => {
    if (!buyerName || !buyerEmail || !buyerNumber) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        price: resource.price || "",
        isFree: resource.isFree,
        buyerName,
        buyerEmail,
        buyerNumber,
        note,
        url: resource.file,
        resourceId: resource._id.toString(),
        createdAt: new Date(),
        delivered: false,
      });

      toast.success("Order placed successfully!");
      setShowSuccessModal(true);

      const emailResponse = await fetch("/api/get-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerEmail, buyerName, buyerNumber, note }),
      });

      if (emailResponse.ok) {
        // close modal handled by DialogTrigger/controlled state
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Dialog>
        <DialogTrigger asChild>
          <MagicButton
            title={resource.isFree ? "Get Now" : "Buy Now"}
            icon={<DollarSign />}
            position="left"
          />
        </DialogTrigger>

        {/* Checkout Dialog */}
        <DialogContent className="bg-black/90 text-white rounded-xl border border-white/10 backdrop-blur-md w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {resource.title}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-1">
              {resource.isFree
                ? "Get instant access to this valuable resource."
                : "Complete your purchase by providing the required payment details below."}
            </DialogDescription>
          </DialogHeader>

          {/* Buyer Info Form */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Your Full Name"
                className="px-4 py-2 rounded-lg border border-gray-700 bg-black text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Your Email Address"
                className="px-4 py-2 rounded-lg border border-gray-700 bg-black text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                value={buyerNumber}
                onChange={(e) => setBuyerNumber(e.target.value)}
                placeholder="Your Contact Number"
                className="px-4 py-2 rounded-lg border border-gray-700 bg-black text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Reference / Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bank payer's details / transaction ID"
                className="px-4 py-2 rounded-lg border border-gray-700 bg-black text-white resize-none h-24 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-300">
                Enter payment reference details. You will receive assets via
                email within 24 hours.
              </p>
            </div>

            <PaymentOptions />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={onCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-red-500 hover:bg-red-600">
                Close
              </Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-black/90 border border-white/10 backdrop-blur-md text-white rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2 space-y-2">
              <p>
                You will receive your purchased assets via email within 24
                hours. Check spam/junk folder if not received.
              </p>
              <p>
                Contact us at{" "}
                <a
                  href="mailto:contact@artistycode.studio"
                  className="text-blue-400 underline"
                >
                  contact@artistycode.studio
                </a>
                if you don&apos;t receive your assets.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Checkout;

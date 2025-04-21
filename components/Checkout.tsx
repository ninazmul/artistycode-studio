"use client";

import React, { useState } from "react";
import { createOrder } from "@/lib/actions/order.actions";
import toast from "react-hot-toast";
import { IResource } from "@/lib/database/models/resource.model";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import MagicButton from "./MagicButton";
import { DollarSign } from "lucide-react";
import PaymentOptions from "./PaymentOptions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const Checkout = ({ resource }: { resource: IResource }) => {
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerNumber, setBuyerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
        resourceId: resource._id,
        createdAt: new Date(),
        delivered: false,
      });

      toast.success("Order placed successfully!");
      setShowSuccessModal(true);

      const emailResponse = await fetch("/api/get-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerEmail,
          buyerName,
          buyerNumber,
          note,
        }),
      });

      if (emailResponse.ok) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="button">
            <MagicButton
              title={`${resource.isFree ? "Get Now" : "Buy Now"}`}
              icon={<DollarSign />}
              position="left"
            />
          </button>
        </SheetTrigger>
        <SheetContent className="bg-black-100/10 dark:bg-black-100/10 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              {resource.title}
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              Get instant access to this valuable resource!
              {!resource.isFree &&
                " Complete your purchase by providing the required payment details below."}
            </SheetDescription>
          </SheetHeader>

          <div>
            {/* Buyer Info */}
            <div className="space-y-4 mt-6">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="buyerName"
                  className="text-sm font-medium text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-black-100 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Full Name"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="buyerEmail"
                  className="text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="buyerEmail"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-black-100 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email Address"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="buyerNumber"
                  className="text-sm font-medium text-white"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="buyerNumber"
                  value={buyerNumber}
                  onChange={(e) => setBuyerNumber(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-black-100 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Contact Number"
                  required
                />
              </div>

              {!resource.isFree && (
                <div>
                  <p className="text-md font-semibold text-white">
                    Total Price: ${Number(resource.price)?.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-white"
                >
                  Reference
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-black-100 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                  placeholder="Bank payer's details..."
                />
                <p className="text-sm text-purple font-semibold mt-1">
                  Please pay using one of the methods below, then enter the
                  transaction ID and any reference details in the reference
                  field. You will receive an email with your purchased assets
                  within 24 hours. If you don&apos;t see the email, please also
                  check your spam or junk folder.
                </p>
                <div>
                  <PaymentOptions />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 mt-6">
              <Button
                type="button"
                onClick={onCheckout}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                size="lg"
                className="w-full bg-red-500 text-white hover:bg-gray-400"
                disabled={loading}
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-black-100/90 border border-white/10 backdrop-blur-md text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-sm mt-2 space-y-2">
              <p>
                You will receive your purchased assets via email within 24
                hours. If you don&apos;t see the email, please also check your
                spam or junk folder.
              </p>
              <p>
                If you don&apos;t receive the assets within 24 hours, please
                contact us at{" "}
                <a
                  href="mailto:contact@artistycode.studio"
                  className="text-blue-400 underline"
                >
                  contact@artistycode.studio
                </a>
                .
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;

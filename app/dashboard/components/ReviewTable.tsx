"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { IReview } from "@/lib/database/models/review.model";
import { deleteReview, updateReview } from "@/lib/actions/review.actions";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ReviewTable = ({
  reviews,
}: {
  reviews: Array<IReview>;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [reviews, searchQuery]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteReview(confirmDeleteId);
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const toggleVerified = async (review: IReview) => {
    try {
      await updateReview(review._id.toString(), {
        verified: !review.verified,
      });
      toast.success("Updated");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* Search */}
      <div className="flex justify-center">
        <Input
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black border-white/20 text-white"
        />
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((review, index) => (
          <div
            key={index}
            className="group border border-white/10 rounded-xl p-6 backdrop-blur-md transition"
          >
            {/* Header */}
            <div className="space-y-2">
              {/* Header: Avatar + Name + Title */}
              <div className="flex items-center gap-4">
                <Image
                  src={review.image}
                  alt={review.title}
                  width={50}
                  height={50}
                  className="rounded-full object-cover h-12 w-12"
                />
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold">{review.name}</h3>
                  <p className="text-white/60 text-sm">{review.title}</p>
                </div>
              </div>

              {/* Quote / Description */}
              <p className="text-white/70 text-sm mt-3">{review.quote}</p>
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => toggleVerified(review)}>
                {review.verified ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
              </button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setConfirmDeleteId(review._id.toString())}
              >
                <Trash className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="bg-black border border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Review?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewTable;

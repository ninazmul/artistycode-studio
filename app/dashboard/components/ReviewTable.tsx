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

const ReviewTable = ({
  reviews,
}: {
  reviews: Array<IReview>;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [reviews, searchQuery]);

  const handleDeleteReview = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteReview(confirmDeleteId);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleToggleVerified = async (review: IReview) => {
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
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search reviews..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white/5 border-white/10 focus:ring-0"
      />

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.map((review, index) => (
              <tr
                key={index}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4">{review.name}</td>
                <td className="p-4">{review.title}</td>

                {/* Verified */}
                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleVerified(review)}
                  >
                    {review.verified ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </Button>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfirmDeleteId(review._id.toString())}
                  >
                    <Trash className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE DIALOG */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="bg-black border border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Review?</DialogTitle>
          </DialogHeader>

          <p className="text-white/60 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewTable;

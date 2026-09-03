"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, CheckCircle, XCircle, Search, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IReview } from "@/lib/database/models/review.model";
import { deleteReview, updateReview } from "@/lib/actions/review.actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ReviewTable = ({
  reviews,
  userId,
}: {
  reviews: Array<IReview>;
  userId: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(
      (r) => r.name?.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteReview(deleteDialog.id);
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const toggleVerified = async (review: IReview) => {
    setTogglingId(String(review._id));
    try {
      await updateReview(String(review._id), { verified: !review.verified });
      toast.success(review.verified ? "Unverified" : "Verified");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <Input
          placeholder="Search by name or title…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      <div className="text-xs text-white/30">
        {filtered.length} testimonial{filtered.length !== 1 ? "s" : ""}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Author", "Title", "Quote", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-white/20 text-sm">No reviews found</td></tr>
            ) : filtered.map((review, idx) => (
              <tr key={String(review._id) || idx} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {review.image ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/5 shrink-0">
                        <Image src={review.image} alt={review.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white/40 text-sm font-semibold">
                        {review.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white/80 line-clamp-1">{review.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-white/50 max-w-[200px]">
                  <span className="line-clamp-1 block">{review.title}</span>
                </td>
                <td className="px-4 py-3.5 text-white/40 max-w-[200px]">
                  <span className="line-clamp-1 block text-xs italic">
                    &ldquo;{review.quote ? review.quote.slice(0, 60) + (review.quote.length > 60 ? "…" : "") : ""}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {review.verified ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-white/30 text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleVerified(review)}
                      disabled={togglingId === String(review._id)}
                      className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${review.verified ? "bg-white/5 hover:bg-white/10 text-emerald-400" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"}`}
                      title={review.verified ? "Unverify" : "Verify"}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ open: true, id: String(review._id) })}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle className="text-white text-base">Delete Review?</DialogTitle></DialogHeader>
          <p className="text-white/50 text-sm mt-1">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null })} className="text-white/50 hover:text-white">Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm">{isDeleting ? "Deleting…" : "Delete"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewTable;

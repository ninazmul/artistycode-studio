import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { getAllReviews } from "@/lib/actions/review.actions";
import ReviewForm from "../components/ReviewForm";
import ReviewTable from "../components/ReviewTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Stars, CheckCircle } from "lucide-react";

const Page = async () => {
  const authData = await auth();
  const userId = authData.userId || "";
  const reviews = await getAllReviews();

  const verifiedCount = reviews?.filter((r: any) => r.verified).length || 0;

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Community</p>
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-sm text-white/40 mt-1">Manage client reviews and credibility signals.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-[11px] font-medium text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              {verifiedCount} Verified
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white text-base">Add Testimonial</DialogTitle>
                  <p className="text-white/40 text-sm mt-1">Add a new client review to the platform.</p>
                </DialogHeader>
                <div className="mt-4">
                  <ReviewForm type="Create" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Stars className="w-3.5 h-3.5 text-amber-400" />
          <span>{reviews?.length || 0} total testimonial{reviews?.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <ReviewTable userId={userId} reviews={reviews} />
        </div>
      </div>
    </section>
  );
};

export default Page;

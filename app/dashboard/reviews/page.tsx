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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const reviews = await getAllReviews();

  return (
    <section className="bg-black min-h-screen text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Reviews Management
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Manage testimonials and credibility signals
            </p>
          </div>

          {/* Add Review */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6 bg-white text-black hover:bg-white/80">
                Add Review
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/10 max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Review</DialogTitle>
                <DialogDescription>
                  Create a new testimonial entry.
                </DialogDescription>
              </DialogHeader>

              <ReviewForm type="Create" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <ReviewTable userId={userId} reviews={reviews} />
      </div>
    </section>
  );
};

export default Page;

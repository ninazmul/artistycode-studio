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

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const reviews = await getAllReviews();

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Testimonials</h1>
            <p className="text-white/50 text-sm mt-2">
              Manage user feedback & credibility signals
            </p>
          </div>

          {/* Add Project */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                Add Review
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Review</DialogTitle>
              </DialogHeader>

              <div className="pt-4">
                <ReviewForm type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <ReviewTable userId={userId} reviews={reviews} />
        </div>
      </div>
    </section>
  );
};

export default Page;

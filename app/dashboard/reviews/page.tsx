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
    <section className="bg-black text-white min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Cinematic Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold">Testimonials</h1>
          <p className="text-white/60 text-sm">
            Manage user feedback & credibility signals
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full px-8 py-6 text-sm bg-white text-black hover:bg-white/80">
                Add Review
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black/90 border border-white/10 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>Add Review</DialogTitle>
              </DialogHeader>

              <ReviewForm type="Create" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Content */}
        <ReviewTable userId={userId} reviews={reviews} />
      </div>
    </section>
  );
};

export default Page;

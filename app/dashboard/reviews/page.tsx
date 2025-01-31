import { auth } from "@clerk/nextjs/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAllReviews } from "@/lib/actions/review.actions";
import ReviewForm from "../components/ReviewForm";
import ReviewTable from "../components/ReviewTable";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const reviews = await getAllReviews();

  return (
    <>
      <section className="backdrop-blur-md shadow-md py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="text-3xl text-center sm:text-left">
              All Reviews
            </h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full bg-purple">
                Add Review
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
            <SheetHeader>
              <SheetTitle>Add Review</SheetTitle>
              <SheetDescription>
                Use this form to upload a new review. Ensure the content is
                high-quality and follows the guidelines for proper organization
                within the review library.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <ReviewForm type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <ReviewTable userId={userId} reviews={reviews} />
      </div>
    </>
  );
};

export default Page;

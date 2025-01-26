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
import { getAllBanner } from "@/lib/actions/banner.actions";
import BannerTable from "../components/BannerTable";
import BannerForm from "../components/BannerForm";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const banners = await getAllBanner();

  return (
    <>
      <section className="bg-green-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="h3-bold text-center sm:text-left">All Banners</h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full">
                Add Photo
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
            <SheetHeader>
              <SheetTitle>Add Photo to Banner</SheetTitle>
              <SheetDescription>
                Use this form to upload a photo to the banner. Ensure the image
                is high-quality and follows the system&apos;s guidelines for
                proper display and organization within the banner.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <BannerForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <BannerTable banners={banners} />
      </div>
    </>
  );
};

export default Page;

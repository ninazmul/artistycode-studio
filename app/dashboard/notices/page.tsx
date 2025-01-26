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
import { getAllNotice } from "@/lib/actions/notice.actions";
import NoticeTable from "../components/NoticeTable";
import NoticeForm from "../components/NoticeForm";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const notices = await getAllNotice();

  return (
    <>
      <section className="bg-green-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="h3-bold text-center sm:text-left">All Notices</h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full">
                Add Notice
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="bg-white">
            <SheetHeader>
              <SheetTitle>Post Notice for Volunteers</SheetTitle>
              <SheetDescription>
                Fill out this form to publish a notice on the board. Ensure the
                image is of high quality and complies with the system&apos;s
                guidelines for optimal display and proper organization.
              </SheetDescription>
            </SheetHeader>

            <div className="py-5">
              <NoticeForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <NoticeTable notices={notices} />
      </div>
    </>
  );
};

export default Page;

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
import ResourceForm from "../components/ResourceForm";
import { getAllResource } from "@/lib/actions/resource.actions";
import ResourceTable from "../components/ResourceTable";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const resources = await getAllResource();

  return (
    <>
      <section className="bg-green-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="h3-bold text-center sm:text-left">
              Resource Library
            </h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full">
                Add Resource
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="bg-white">
            <SheetHeader>
              <SheetTitle>Add Resource</SheetTitle>
              <SheetDescription>
                Use this form to upload a new resource. Ensure the content is
                high-quality and follows the guidelines for proper organization
                within the resource library.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <ResourceForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <ResourceTable userId={userId} resources={resources} />
      </div>
    </>
  );
};

export default Page;

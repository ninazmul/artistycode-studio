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
import ResourceTable from "../components/ResourceTable";
import { getAllResources } from "@/lib/actions/resource.actions";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  const resources = await getAllResources();

  return (
    <>
      <section className="backdrop-blur-md shadow-md py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="text-3xl text-center sm:text-left">
              Resources Library
            </h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full bg-purple">
                Add Resource
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
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
        <ResourceTable
          userId={userId}
          isAdmin={adminStatus}
          resources={resources}
        />
      </div>
    </>
  );
};

export default Page;

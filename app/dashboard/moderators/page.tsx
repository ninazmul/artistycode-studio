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
import ModeratorForm from "../components/ModeratorForm";
import ModeratorTable from "../components/ModeratorTable";
import { getAllModerators } from "@/lib/actions/moderator.actions";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const moderators = await getAllModerators();

  return (
    <>
      <section className="backdrop-blur-md shadow-md bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="text-3xl text-center sm:text-left">All Moderators</h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full bg-purple">
                Create Moderator
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
            <SheetHeader>
              <SheetTitle>Create New Moderator</SheetTitle>
              <SheetDescription>
                Use this form to create a new moderator account within the system.
                Fill out all required fields accurately to ensure proper setup
                and access permissions for the new moderator.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <ModeratorForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <ModeratorTable moderators={moderators} />
      </div>
    </>
  );
};

export default Page;

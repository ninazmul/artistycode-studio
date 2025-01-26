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
import { getAllRegistrations } from "@/lib/actions/registration.actions";
import RegistrationFrom from "../components/RegistrationForm";
import VolunteerTable from "../components/VolunteerTable";
import JsonToExcel from "../components/JsonToExcel";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const volunteers = await getAllRegistrations();

  return (
    <>
      <section className="bg-green-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center gap-4 mx-auto">
            <div className="flex items-center gap-2">
              <h3 className="h3-bold text-center sm:text-left">
                All Volunteers
              </h3>
              <JsonToExcel data={volunteers} fileName="volunteers.xlsx" />
            </div>
            <SheetTrigger className="w-full md:w-max">
              <Button size="lg" className="rounded-full w-full">
                Add Volunteer
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="bg-white">
            <SheetHeader>
              <SheetTitle>Add a Volunteer</SheetTitle>
              <SheetDescription>
                Use this form to add a volunteer to the system. Ensure the
                information provided is accurate and complete, adhering to the
                system&apos;s guidelines for proper record management and
                organization.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <RegistrationFrom userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <VolunteerTable registrations={volunteers} />
      </div>
    </>
  );
};

export default Page;

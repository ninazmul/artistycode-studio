import { auth } from "@clerk/nextjs/server";
import { getAllAdmins } from "@/lib/actions/admin.actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminForm from "../components/AdminForm";
import AdminTable from "../components/AdminTable";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const admins = await getAllAdmins();

  return (
    <>
      <section className="bg-green-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="h3-bold text-center sm:text-left">All Admins</h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full">
                Create Admin
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
            <SheetHeader>
              <SheetTitle>Create New Admin</SheetTitle>
              <SheetDescription>
                Use this form to create a new admin account within the system.
                Fill out all required fields accurately to ensure proper setup
                and access permissions for the new admin.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <AdminForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <AdminTable admins={admins} />
      </div>
    </>
  );
};

export default Page;

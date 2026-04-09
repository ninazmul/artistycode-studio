import { auth } from "@clerk/nextjs/server";
import { getAllAdmins } from "@/lib/actions/admin.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminForm from "../components/AdminForm";
import AdminTable from "../components/AdminTable";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const admins = await getAllAdmins();

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Admins</h1>
            <p className="text-white/50 text-sm mt-2">
              View, add, and manage all admins for your platform.
            </p>
          </div>
          {/* Add Project */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                Add Admin
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
              </DialogHeader>

              <div className="pt-4">
                <AdminForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <AdminTable admins={admins} />
        </div>
      </div>
    </section>
  );
};

export default Page;

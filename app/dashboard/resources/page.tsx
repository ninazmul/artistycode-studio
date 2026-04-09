import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import ResourceForm from "../components/ResourceForm";
import ResourceTable from "../components/ResourceTable";
import { getAllResources } from "@/lib/actions/resource.actions";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";

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
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  const resources = await getAllResources();

  return (
    <section className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Resources Library</h1>
            <p className="text-white/60 text-sm mt-1">
              Manage and organize all your digital assets
            </p>
          </div>

          {/* Dialog Trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                + Add Resource
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Resource</DialogTitle>
              </DialogHeader>

              <ResourceForm userId={userId} type="Create" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <ResourceTable
            userId={userId}
            isAdmin={adminStatus}
            resources={resources}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;

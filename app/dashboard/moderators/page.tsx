import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ModeratorForm from "../components/ModeratorForm";
import ModeratorTable from "../components/ModeratorTable";
import { getAllModerators } from "@/lib/actions/moderator.actions";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const moderators = await getAllModerators();

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Moderators</h1>
            <p className="text-white/50 text-sm mt-2">
              View, add, and manage all moderators for your platform.
            </p>
          </div>
          {/* Add Project */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                Add Moderator
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Moderator</DialogTitle>
              </DialogHeader>

              <div className="pt-4">
                <ModeratorForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <ModeratorTable moderators={moderators} />
        </div>
      </div>
    </section>
  );
};

export default Page;

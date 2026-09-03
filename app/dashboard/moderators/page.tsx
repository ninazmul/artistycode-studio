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
import { Plus, ShieldHalf } from "lucide-react";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const moderators = await getAllModerators();

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Administration</p>
            <h1 className="text-3xl font-bold tracking-tight">Moderators</h1>
            <p className="text-sm text-white/40 mt-1">View, add, and manage content moderators for your platform.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                <Plus className="w-4 h-4" />
                Add Moderator
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Add Moderator</DialogTitle>
                <p className="text-white/40 text-sm mt-1">Grant moderator access to a trusted team member.</p>
              </DialogHeader>
              <div className="mt-4">
                <ModeratorForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-xs text-white/30">
          <ShieldHalf className="w-3.5 h-3.5 text-blue-400" />
          <span>{moderators?.length || 0} moderator{moderators?.length !== 1 ? "s" : ""} with content access</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <ModeratorTable moderators={moderators} />
        </div>
      </div>
    </section>
  );
};

export default Page;

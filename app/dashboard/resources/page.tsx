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
import { Plus, CodeIcon } from "lucide-react";

const Page = async () => {
  const authData = await auth();
  const userId = authData.userId || "";

  const [email, resources] = await Promise.all([
    getUserEmailById(userId),
    getAllResources(),
  ]);
  const adminStatus = await isAdmin(email || "");

  const freeCount = resources?.filter((r: any) => r.isFree).length || 0;
  const paidCount = (resources?.length || 0) - freeCount;

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Core</p>
            <h1 className="text-3xl font-bold tracking-tight">Resources Library</h1>
            <p className="text-sm text-white/40 mt-1">Manage and organize all digital assets and code templates.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-[11px] font-medium text-emerald-400">
              {freeCount} Free
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/15 text-[11px] font-medium text-purple-400">
              {paidCount} Paid
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white text-base">Add New Resource</DialogTitle>
                  <p className="text-white/40 text-sm mt-1">Publish a new template or digital asset.</p>
                </DialogHeader>
                <div className="mt-4">
                  <ResourceForm userId={userId} type="Create" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-xs text-white/30">
          <CodeIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{resources?.length || 0} resource{resources?.length !== 1 ? "s" : ""} published</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <ResourceTable userId={userId} isAdmin={adminStatus} resources={resources} />
        </div>
      </div>
    </section>
  );
};

export default Page;

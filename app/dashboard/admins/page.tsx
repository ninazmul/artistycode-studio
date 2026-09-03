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
import { Plus, Shield } from "lucide-react";

const Page = async () => {
  const authData = await auth();
  const userId = authData.userId || "";
  const admins = await getAllAdmins();

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Administration</p>
            <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
            <p className="text-sm text-white/40 mt-1">View, add, and manage all admins for your platform.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                <Plus className="w-4 h-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Add Admin</DialogTitle>
                <p className="text-white/40 text-sm mt-1">Grant admin access to a trusted user.</p>
              </DialogHeader>
              <div className="mt-4">
                <AdminForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Count Badge */}
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>{admins?.length || 0} admin{admins?.length !== 1 ? "s" : ""} with full access</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <AdminTable admins={admins} userId={userId} />
        </div>
      </div>
    </section>
  );
};

export default Page;

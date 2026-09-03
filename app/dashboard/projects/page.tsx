import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import ProjectForm from "../components/ProjectForm";
import ProjectTable from "../components/ProjectTable";
import { getAllProjects } from "@/lib/actions/project.actions";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FilesIcon } from "lucide-react";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const [email, projects] = await Promise.all([
    getUserEmailById(userId),
    getAllProjects(),
  ]);
  const adminStatus = await isAdmin(email);

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Core</p>
            <h1 className="text-3xl font-bold tracking-tight">Projects Library</h1>
            <p className="text-sm text-white/40 mt-1">Manage and organize all portfolio projects.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Add New Project</DialogTitle>
                <p className="text-white/40 text-sm mt-1">Fill out all project details to add it to the portfolio.</p>
              </DialogHeader>
              <div className="mt-4">
                <ProjectForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-xs text-white/30">
          <FilesIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{projects?.length || 0} project{projects?.length !== 1 ? "s" : ""} in portfolio</span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <ProjectTable userId={userId} isAdmin={adminStatus} projects={projects} />
        </div>
      </div>
    </section>
  );
};

export default Page;

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

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);
  const projects = await getAllProjects();

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Projects Library</h1>
            <p className="text-white/50 text-sm mt-2">
              Manage and organize all your projects
            </p>
          </div>

          {/* Add Project */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                Add Project
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>

              <div className="pt-4">
                <ProjectForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <ProjectTable
            userId={userId}
            isAdmin={adminStatus}
            projects={projects}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;

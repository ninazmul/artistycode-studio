"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProjectForm from "./ProjectForm";
import { IProject } from "@/lib/database/models/project.model";
import { deleteProject } from "@/lib/actions/project.actions";

const ProjectTable = ({
  projects,
  userId,
  isAdmin,
}: {
  projects: Array<IProject>;
  userId: string;
  isAdmin: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => (isAdmin ? true : p.author === userId))
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [projects, searchQuery, userId, isAdmin]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    await deleteProject(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black border-white/20 text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left py-3">Project</th>
              <th>Category</th>
              <th>Stack</th>
              <th>Link</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition align-middle"
              >
                {/* Project */}
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover h-12 w-12"
                    />
                    <span className="line-clamp-1 truncate w-40 md:w-auto font-medium">
                      {project.title}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="align-middle">
                  <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
                    {project.category}
                  </span>
                </td>

                {/* Stack */}
                <td className="align-middle">
                  <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70">
                    {project.stack}
                  </span>
                </td>

                {/* Link */}
                <td className="align-middle">
                  <Link
                    href={project.url}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>

                {/* Actions */}
                <td className="align-middle text-right space-x-2 whitespace-nowrap">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                      </DialogHeader>

                      <ProjectForm
                        userId={userId}
                        project={project}
                        projectId={project._id.toString()}
                        type="Update"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(project._id.toString())}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>

          <p className="text-white/70">
            Are you sure you want to delete this project?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTable;

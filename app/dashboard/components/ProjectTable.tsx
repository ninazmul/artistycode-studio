"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProject } from "@/lib/database/models/project.model";
import { deleteProject } from "@/lib/actions/project.actions";
import toast from "react-hot-toast";

// Lazy-load heavy form
const ProjectForm = dynamic(() => import("./ProjectForm"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-white/[0.03]" />,
});

const PAGE_SIZE = 10;

const ProjectTable = ({
  projects,
  userId,
  isAdmin,
}: {
  projects: Array<IProject>;
  userId: string;
  isAdmin: boolean;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editDialog, setEditDialog] = useState<{ open: boolean; project: IProject | null }>({ open: false, project: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // O(N) filter — combined admin and search filter in single pass
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      if (!isAdmin && p.author !== userId) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [projects, search, userId, isAdmin]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSlice = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteDialog.id);
      toast.success("Project deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <Input
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Project", "Category", "Stack", "Link", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageSlice.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-white/20 text-sm">
                  No projects found
                </td>
              </tr>
            ) : (
              pageSlice.map((project, idx) => (
                <tr
                  key={String(project._id) || idx}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-white/80 line-clamp-1 max-w-[180px]">
                        {project.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/50 border border-white/10">
                      {project.stack}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={project.url}
                      target="_blank"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditDialog({ open: true, project })}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, id: String(project._id) })}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Delete"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-white/40 hover:text-white disabled:opacity-20">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-white text-black" : "text-white/30 hover:text-white hover:bg-white/10"}`}>{p}</button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-white/40 hover:text-white disabled:opacity-20">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(o) => setEditDialog({ open: o, project: editDialog.project })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Edit Project</DialogTitle>
          </DialogHeader>
          {editDialog.project && (
            <ProjectForm
              userId={userId}
              project={editDialog.project}
              projectId={String(editDialog.project._id)}
              type="Update"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Delete Project?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm mt-1">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null })} className="text-white/50 hover:text-white">Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm">
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTable;

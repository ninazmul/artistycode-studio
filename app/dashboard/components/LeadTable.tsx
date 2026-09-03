"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, Mail, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteLead } from "@/lib/actions/lead.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Lazy load heavy forms & email dialog
const LeadForm = dynamic(() => import("./LeadForm"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-white/[0.03]" />,
});
const EmailDialog = dynamic(() => import("./EmailDialog"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-white/[0.03]" />,
});

const PAGE_SIZE = 12;

type LeadType = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: Date;
};

const statusColors: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Contacted: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  Emailed: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  Qualified: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Converted: "bg-green-500/15 text-green-300 border-green-500/20",
  Lost: "bg-red-500/15 text-red-300 border-red-500/20",
};

const LeadTable = ({
  leads,
  onRefresh,
}: {
  leads: Array<LeadType>;
  onRefresh: () => void;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Set-based selection — O(1) has/add/delete vs O(N) array.includes()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Single lifted dialog state — no N form instances
  const [editDialog, setEditDialog] = useState<{ open: boolean; lead: LeadType | null }>({ open: false, lead: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [emailDialog, setEmailDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // O(N) single pass filter
  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSlice = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(filtered.map((l) => l._id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [filtered]
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteDialog.id);
      toast.success("Lead deleted");
      onRefresh();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete lead");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  // Build recipient list from Set — O(N) one-pass using Set.has() for O(1) lookup
  const emailRecipients = useMemo(
    () =>
      leads
        .filter((l) => selectedIds.has(l._id))
        .map(({ _id, name, email, company }) => ({ _id, name, email, company })),
    [leads, selectedIds]
  );

  const allPageSelected = pageSlice.every((l) => selectedIds.has(l._id));

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <Input
            placeholder="Search leads by name, email, company, status…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
          />
        </div>
        {selectedIds.size > 0 && (
          <Button
            onClick={() => setEmailDialog(true)}
            className="bg-indigo-500/90 hover:bg-indigo-500 text-white rounded-xl h-10 text-sm gap-2 shrink-0"
          >
            <Mail className="w-4 h-4" />
            Email {selectedIds.size} selected
          </Button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</span>
        {selectedIds.size > 0 && (
          <span className="text-indigo-400">{selectedIds.size} selected</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageSlice.length > 0 && allPageSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-white/20 bg-transparent accent-indigo-500 w-3.5 h-3.5"
                />
              </th>
              {["Name", "Company", "Status", "Date", ""].map((h) => (
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
                <td colSpan={6} className="text-center py-12 text-white/20 text-sm">
                  No leads found
                </td>
              </tr>
            ) : (
              pageSlice.map((lead, idx) => (
                <tr
                  key={lead._id || idx}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group ${
                    selectedIds.has(lead._id) ? "bg-indigo-500/[0.04]" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead._id)}
                      onChange={(e) => handleSelectOne(lead._id, e.target.checked)}
                      className="rounded border-white/20 bg-transparent accent-indigo-500 w-3.5 h-3.5"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-white/80 line-clamp-1">{lead.name}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/50 text-xs">
                    {lead.company || <span className="text-white/15">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        statusColors[lead.status] || "bg-white/10 text-white/40 border-white/10"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-white/30 text-xs whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditDialog({ open: true, lead })}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, id: lead._id })}
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-white/40 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                p === page ? "bg-white text-black" : "text-white/30 hover:text-white hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-white/40 hover:text-white disabled:opacity-20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Edit Lead Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(o) => setEditDialog({ open: o, lead: editDialog.lead })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Edit Lead</DialogTitle>
          </DialogHeader>
          {editDialog.lead && (
            <LeadForm
              type="Update"
              lead={editDialog.lead}
              onSuccess={() => {
                setEditDialog({ open: false, lead: null });
                onRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              Send Email to {selectedIds.size} Lead{selectedIds.size !== 1 ? "s" : ""}
            </DialogTitle>
          </DialogHeader>
          <EmailDialog
            selectedLeads={emailRecipients}
            onSuccess={() => {
              setEmailDialog(false);
              setSelectedIds(new Set());
              onRefresh();
            }}
            onClose={() => setEmailDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Delete Lead?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm mt-1">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null })} className="text-white/50 hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm">
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadTable;

"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, StickyNote, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { deleteTransaction } from "@/lib/actions/transaction.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Lazy load heavy form — only rendered when dialog opens
const TransactionForm = dynamic(() => import("./TransactionForm"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-xl bg-white/[0.03]" />
  ),
});

const PAGE_SIZE = 10;

const categoryColors: Record<string, string> = {
  WebApps: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  MobileApps: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Games: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  Reserve: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Spend: "bg-red-500/15 text-red-300 border-red-500/20",
  Others: "bg-white/10 text-white/50 border-white/10",
};

const TransactionTable = ({
  transactions,
  userId,
}: {
  transactions: Array<ITransaction>;
  userId: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Single lifted dialog state — prevents N form instances in DOM
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
  const [editDialog, setEditDialog] = useState<{ open: boolean; transaction: ITransaction | null }>({ open: false, transaction: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // O(N) single-pass filter — no nested loops
  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.category?.toLowerCase().includes(q) ||
        t.project?.toLowerCase().includes(q) ||
        String(t.amount || "").includes(q) ||
        String(t.due_amount || "").includes(q)
    );
  }, [transactions, search]);

  // Efficient page slice — O(1) relative to dataset size
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSlice = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1); // reset on search
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteDialog.id);
      toast.success("Transaction deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <Input
          placeholder="Search by project, category, amount…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Date", "Category", "Project", "Paid", "Due", "Notes", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageSlice.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-white/20 text-sm">
                  No transactions found
                </td>
              </tr>
            ) : (
              pageSlice.map((t, idx) => (
                <tr
                  key={String(t._id) || idx}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-4 py-3.5 text-white/40 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[t.category] || categoryColors["Others"]}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-white/70 max-w-[200px]">
                    <span className="line-clamp-1 block">{t.project}</span>
                  </td>
                  <td className="px-4 py-3.5 text-emerald-400 font-semibold tabular-nums whitespace-nowrap">
                    ৳ {Number(t.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums whitespace-nowrap">
                    {Number(t.due_amount || 0) > 0 ? (
                      <span className="text-amber-400">৳ {Number(t.due_amount).toLocaleString()}</span>
                    ) : (
                      <span className="text-white/15">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setNoteDialog({ open: true, text: t.notes || "" })}
                      className="text-white/25 hover:text-blue-400 transition-colors"
                      title="View note"
                    >
                      <StickyNote className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditDialog({ open: true, transaction: t })}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/50 hover:text-white transition-all"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, id: String(t._id) })}
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
                p === page
                  ? "bg-white text-black"
                  : "text-white/30 hover:text-white hover:bg-white/10"
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

      {/* Note Dialog — single instance */}
      <Dialog open={noteDialog.open} onOpenChange={(o) => setNoteDialog({ open: o, text: "" })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Transaction Note</DialogTitle>
          </DialogHeader>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            {noteDialog.text || "No notes for this transaction."}
          </p>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog — single lazy-loaded form instance */}
      <Dialog open={editDialog.open} onOpenChange={(o) => setEditDialog({ open: o, transaction: editDialog.transaction })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Edit Transaction</DialogTitle>
          </DialogHeader>
          {editDialog.transaction && (
            <TransactionForm
              userId={userId}
              transaction={editDialog.transaction}
              transactionId={String(editDialog.transaction._id)}
              type="Update"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Delete Transaction?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm mt-1">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialog({ open: false, id: null })}
              className="text-white/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionTable;

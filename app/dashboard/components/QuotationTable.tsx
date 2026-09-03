"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Copy,
  ExternalLink,
  DollarSign,
  FileCheck,
  Trash,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteQuotation } from "@/lib/actions/quotation.actions";
import InvoiceMilestoneModal from "./InvoiceMilestoneModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 10;

interface QuotationTableProps {
  quotations: any[];
  onRefresh?: () => void;
}

const statusStyles: Record<string, string> = {
  Draft: "text-white/40 bg-white/5 border-white/10",
  Sent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Signed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Active: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Completed: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
  Cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function QuotationTable({ quotations, onRefresh }: QuotationTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Lifted dialog state
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // O(N) single-pass search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return quotations;
    const q = search.toLowerCase();
    return quotations.filter(
      (qt) =>
        qt.quotationNumber?.toLowerCase().includes(q) ||
        qt.title?.toLowerCase().includes(q) ||
        qt.clientName?.toLowerCase().includes(q) ||
        qt.companyName?.toLowerCase().includes(q) ||
        qt.status?.toLowerCase().includes(q)
    );
  }, [quotations, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSlice = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const copyAgreementLink = (id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://artistycode.studio";
    const url = `${origin}/agreement/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public Agreement link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteQuotation(deleteDialog.id);
      toast.success("Quotation deleted");
      if (onRefresh) onRefresh();
      router.refresh();
    } catch {
      toast.error("Failed to delete quotation");
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
          placeholder="Search by quote #, client, company, title..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      <div className="flex justify-between text-xs text-white/30">
        <span>{filtered.length} quotation{filtered.length !== 1 ? "s" : ""}</span>
        {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Quotation & Client", "Budget", "Agreement", "Invoices (30/40/30)", ""].map((h) => (
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
                  No quotations found
                </td>
              </tr>
            ) : (
              pageSlice.map((q) => {
                const currSymbol = q.currency === "BDT" ? "৳" : "$";
                const paidInvoicesCount = q.invoices?.filter((inv: any) => inv.status === "Paid").length || 0;
                const hasOverdue = q.invoices?.some((inv: any) => inv.status === "Overdue");

                return (
                  <tr
                    key={q._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Quotation & Client */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-white/40">
                          {q.quotationNumber}
                        </span>
                        <button
                          onClick={() => copyAgreementLink(q._id)}
                          title="Copy public agreement URL"
                          className="text-white/30 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-semibold text-white/90 line-clamp-1 max-w-[220px]">
                        {q.title}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {q.companyName || q.clientName} ({q.clientEmail})
                      </p>
                    </td>

                    {/* Total Budget */}
                    <td className="px-4 py-3.5">
                      <span className="text-emerald-400 font-bold tabular-nums">
                        {currSymbol}{q.totalBudget?.toLocaleString()}
                      </span>
                    </td>

                    {/* Agreement Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          statusStyles[q.status] || statusStyles.Draft
                        }`}
                      >
                        {q.status === "Signed" && <ShieldCheck className="w-3 h-3" />}
                        {q.status === "Sent" && <Clock className="w-3 h-3" />}
                        {q.status}
                      </span>
                    </td>

                    {/* Invoices 30/40/30 Progress */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full border ${
                            paidInvoicesCount === 3
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : hasOverdue
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-white/[0.04] text-white/60 border-white/10"
                          }`}
                        >
                          {paidInvoicesCount}/3 Paid
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuotation(q);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="h-7 text-xs bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white rounded-lg px-2"
                        >
                          Manage
                        </Button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Open Public Agreement */}
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="p-1.5 h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg"
                        >
                          <Link href={`/agreement/${q._id}`} target="_blank" title="View Agreement">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </Button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteDialog({ open: true, id: q._id })}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                          title="Delete Quotation"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

      {/* Lifted Invoice Milestone Modal */}
      <InvoiceMilestoneModal
        quotation={selectedQuotation}
        open={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
        onRefresh={() => {
          if (onRefresh) onRefresh();
          router.refresh();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Delete Quotation?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm mt-1">
            This will permanently remove the proposal, agreement, and milestone invoices.
          </p>
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
}

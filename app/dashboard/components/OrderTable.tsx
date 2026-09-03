"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, CheckCircle, Clock, Notebook, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/order.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Lazy-load note dialog contents only when needed
const PAGE_SIZE = 10;

const OrderTable = ({ orders }: { orders: any[] }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Single-instance lifted dialogs
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // O(N) single-pass filter using Set-friendly early exit
  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.buyerName?.toLowerCase().includes(q) ||
        o.buyerEmail?.toLowerCase().includes(q) ||
        o.resourceTitle?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageSlice = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleStatusToggle = async (order: any) => {
    setTogglingId(order._id);
    try {
      await updateOrderStatus(order._id, !order.delivered);
      toast.success(order.delivered ? "Marked as Pending" : "Marked as Delivered");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteOrder(deleteDialog.id);
      toast.success("Order deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete order");
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
          placeholder="Search by buyer, email, or product…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
        {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Buyer", "Product", "Price", "Status", "Date", ""].map((h) => (
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
                  No orders found
                </td>
              </tr>
            ) : (
              pageSlice.map((order, idx) => (
                <tr
                  key={order._id || idx}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-white/80 line-clamp-1">{order.buyerName}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{order.buyerEmail}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/60 max-w-[160px]">
                    <span className="line-clamp-1 block">{order.resourceTitle}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {order.isFree ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Free
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        ${order.price}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {order.delivered ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-white/30 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Note */}
                      <button
                        onClick={() => setNoteDialog({ open: true, text: order.note || "" })}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-blue-400 transition-all"
                        title="View note"
                      >
                        <Notebook className="w-3.5 h-3.5" />
                      </button>
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleStatusToggle(order)}
                        disabled={togglingId === order._id}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all disabled:opacity-30"
                        title="Toggle status"
                      >
                        {order.delivered ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeleteDialog({ open: true, id: order._id })}
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

      {/* Note Dialog */}
      <Dialog open={noteDialog.open} onOpenChange={(o) => setNoteDialog({ open: o, text: "" })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Order Note</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm leading-relaxed mt-2">
            {noteDialog.text || "No note for this order."}
          </p>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Delete Order?</DialogTitle>
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

export default OrderTable;

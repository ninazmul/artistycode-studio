"use client";

import { useState, useMemo, useCallback } from "react";
import { deleteAdmin } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Search, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AdminTable = ({
  admins,
  userId,
}: {
  admins: Array<{ _id: string; name: string; email: string }>;
  userId?: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return admins;
    const q = search.toLowerCase();
    return admins.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  }, [admins, search]);

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteAdmin(deleteDialog.id);
      toast.success("Admin removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove admin");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:border-white/20 rounded-xl h-10 text-sm"
        />
      </div>

      <div className="text-xs text-white/30">{filtered.length} admin{filtered.length !== 1 ? "s" : ""}</div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {["Admin", "Role", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-12 text-white/20 text-sm">No admins found</td></tr>
            ) : filtered.map((admin, idx) => (
              <tr key={admin._id || idx} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white/80">{admin.name}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    Admin
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => setDeleteDialog({ open: true, id: admin._id })}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove admin"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ open: o, id: deleteDialog.id })}>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle className="text-white text-base">Remove Admin?</DialogTitle></DialogHeader>
          <p className="text-white/50 text-sm mt-1">This will revoke their admin access immediately.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null })} className="text-white/50 hover:text-white">Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm">{isDeleting ? "Removing…" : "Remove"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTable;

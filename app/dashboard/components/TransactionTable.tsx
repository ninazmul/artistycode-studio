"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, StickyNote } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { deleteTransaction } from "@/lib/actions/transaction.actions";

const TransactionTable = ({
  transactions,
  userId,
}: {
  transactions: Array<ITransaction>;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.date?.toString().toLowerCase().includes(lowerQuery) ||
        t.category?.toLowerCase().includes(lowerQuery) ||
        t.project?.toLowerCase().includes(lowerQuery) ||
        String(t.amount || "")
          .toLowerCase()
          .includes(lowerQuery) ||
        String(t.due_amount || "")
          .toLowerCase()
          .includes(lowerQuery),
    );
  }, [transactions, searchQuery]);

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black border-white/20 text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full text-sm text-white">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left py-3">#</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Category</th>
              <th className="text-left py-3">Project</th>
              <th className="text-left py-3">Paid Amount</th>
              <th className="text-left py-3">Due Amount</th>
              <th className="text-left py-3">Notes</th>
              <th className="text-right py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-4">{idx + 1}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.category}</td>
                <td>{t.project}</td>
                <td>৳ {t.amount}</td>
                <td>৳ {t.due_amount || 0}</td>
                <td>
                  <Dialog>
                    <DialogTrigger
                      onClick={() => setSelectedNote(t.notes || "")}
                    >
                      <StickyNote className="cursor-pointer text-blue-500" />
                    </DialogTrigger>
                    {selectedNote && (
                      <DialogContent className="bg-black border border-white/10 backdrop-blur-xl p-6">
                        <DialogHeader>
                          <DialogTitle>Full Notes</DialogTitle>
                        </DialogHeader>
                        <p>{selectedNote}</p>
                      </DialogContent>
                    )}
                  </Dialog>
                </td>
                <td className="flex justify-end gap-2">
                  {/* Edit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      <TransactionForm
                        userId={userId}
                        transaction={t}
                        transactionId={t._id.toString()}
                        type="Update"
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(t._id.toString())}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <Dialog
          open={!!confirmDeleteId}
          onOpenChange={() => setConfirmDeleteId(null)}
        >
          <DialogContent className="bg-black border border-white/10 text-white p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
            </DialogHeader>
            <p className="text-white/70">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTransaction(confirmDeleteId)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionTable;

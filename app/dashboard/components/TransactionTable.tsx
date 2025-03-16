"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, SortAsc, SortDesc, Edit, StickyNote, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TransactionForm from "./TransactionForm";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { deleteTransaction } from "@/lib/actions/transaction.actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const TransactionTable = ({
  transactions,
  userId,
}: {
  transactions: Array<ITransaction>;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<
    "date" | "category" | "project" | "amount" | "due_amount" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.date?.toString().toLowerCase().includes(lowerQuery) ||
        transaction.category?.toLowerCase().includes(lowerQuery) ||
        transaction.project?.toLowerCase().includes(lowerQuery) ||
        String(transaction.amount || "")
          .toLowerCase()
          .includes(lowerQuery) ||
        String(transaction.due_amount || "")
          .toLowerCase()
          .includes(lowerQuery)
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valueA = String(a[sortKey] || "").toLowerCase();
        const valueB = String(b[sortKey] || "").toLowerCase();
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [transactions, searchQuery, sortKey, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const response = await deleteTransaction(transactionId);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete transaction");
      console.log(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSort = (
    key: "date" | "category" | "project" | "amount" | "due_amount"
  ) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full md:w-1/2 lg:w-1/3"
      />
      <Table className="border border-gray-200 rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            {["date", "category", "project", "amount", "due_amount"].map(
              (key) => (
                <TableHead key={key}>
                  <div
                    onClick={() => handleSort(key as any)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortKey === key &&
                      (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
                  </div>
                </TableHead>
              )
            )}
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.map((transaction, index) => (
            <TableRow key={transaction._id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.project}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.due_amount}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger
                    onClick={() => setSelectedNote(transaction?.notes || "")}
                  >
                    <StickyNote className="cursor-pointer text-blue-500" />
                  </DialogTrigger>
                  {selectedNote && (
                    <DialogContent className="p-6">
                      <div className="flex justify-start items-center">
                        <h3 className="text-lg font-bold">Full Notes</h3>
                        
                      </div>
                      <p className="mt-2">{selectedNote}</p>
                    </DialogContent>
                  )}
                </Dialog>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                <Sheet>
                  <SheetTrigger>
                    <Button variant="outline" className="text-purple-500">
                      <Edit />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="backdrop-blur-md shadow-md">
                    <SheetHeader>
                      <SheetTitle>Update Transaction Details</SheetTitle>
                      <SheetDescription>
                        Update transaction information to ensure accuracy.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-5">
                      <TransactionForm
                        userId={userId}
                        transaction={transaction}
                        transactionId={transaction._id}
                        type="Update"
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  onClick={() => setConfirmDeleteId(transaction._id)}
                  variant="outline"
                  className="text-red-500"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Showing{" "}
          {Math.min(itemsPerPage * currentPage, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} transactions
        </span>
        <div className="flex items-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            size="sm"
          >
            Previous
          </Button>
          <Button
            disabled={
              currentPage >=
              Math.ceil(filteredTransactions.length / itemsPerPage)
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-md space-y-4">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteTransaction(confirmDeleteId)}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;

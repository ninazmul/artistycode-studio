"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, CheckCircle, Clock, Notebook } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { updateOrderStatus, deleteOrder } from "@/lib/actions/order.actions";

import toast from "react-hot-toast";
import Image from "next/image";

const OrderTable = ({ orders }: { orders: any[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [orders, searchQuery]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteOrder(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const handleStatus = async (order: any) => {
    await updateOrderStatus(order._id, !order.delivered);

    toast.success(
      order.delivered ? "Marked as Pending" : "Marked as Delivered",
    );
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black border-white/20 text-white"
      />

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left">Buyer</th>
              <th className="text-left">Product</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition align-middle"
              >
                {/* order */}
                <td className="py-4 align-left">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.buyerName}</span>
                    <span className="text-xs text-white/50">
                      {order.buyerEmail}
                    </span>
                  </div>
                </td>

                {/* resourceTitle */}
                <td className="align-middle">
                  <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
                    {order.resourceTitle}
                  </span>
                </td>

                {/* price */}
                <td className="align-middle">
                  {order.isFree ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      Free
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                      ${order.price}
                    </span>
                  )}
                </td>

                {/* status */}
                <td className="align-middle">
                  {order.delivered ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle size={14} /> Delivered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                </td>

                {/* date */}
                <td className="align-middle">
                  <span className="text-white/50 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>

                {/* Actions */}
                <td className="align-middle text-right space-x-2">
                  {/* Note */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Notebook size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-black text-white border border-white/10">
                      {order.note || "No note"}
                    </PopoverContent>
                  </Popover>

                  {/* Status Toggle */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleStatus(order)}
                  >
                    {order.delivered ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Clock size={16} className="text-yellow-400" />
                    )}
                  </Button>

                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-400"
                    onClick={() => setConfirmDeleteId(order._id)}
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
            <DialogTitle>Delete Order?</DialogTitle>
          </DialogHeader>

          <p className="text-white/60 text-sm">This action cannot be undone.</p>

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

export default OrderTable;

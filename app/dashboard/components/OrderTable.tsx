"use client";

import { useState, useMemo } from "react";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/order.actions";
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
import {
  Trash,
  SortAsc,
  SortDesc,
  Check,
  Notebook,
  CheckCircle,
  Loader,
  Clock,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const OrderTable = ({
  orders,
}: {
  orders: Array<{
    _id: string;
    resourceTitle: string;
    price: number;
    isFree: boolean;
    buyerName: string;
    buyerEmail: string;
    buyerNumber: string;
    url: string;
    note: string;
    createdAt: string;
    delivered: boolean;
  }>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<
    "name" | "email" | "resourceTitle" | "createdAt" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter(
      (order) =>
        order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valueA =
          typeof a[sortKey as keyof typeof a] === "string"
            ? (a[sortKey as keyof typeof a] as string).toLowerCase()
            : a[sortKey as keyof typeof a];
        const valueB =
          typeof b[sortKey as keyof typeof b] === "string"
            ? (b[sortKey as keyof typeof b] as string).toLowerCase()
            : b[sortKey as keyof typeof b];
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [orders, searchQuery, sortKey, sortOrder]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await deleteOrder(orderId);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete order");
      console.log(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleUpdateOrderStatus: any = async (
    orderId: string,
    delivered: boolean,
    buyerEmail: string,
    url: string
  ) => {
    try {
      const response = await updateOrderStatus(orderId, delivered);

      if (response) {
        // Send email to the buyer after updating order status
        const emailResponse = await fetch("/api/send-order-status-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerEmail,
            orderId,
            status: delivered ? "Delivered" : "Not Delivered",
            url,
          }),
        });

        if (emailResponse.ok) {
          alert("Order status updated and email sent successfully!");
        } else {
          alert("Failed to send email to the buyer.");
        }
      }
    } catch (error) {
      alert("Failed to update order status");
      console.log(error);
    }
  };

  const handleSort = (
    key: "name" | "email" | "resourceTitle" | "createdAt"
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
        placeholder="Search by name, email, or resource title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("name")}>
              Buyer Name
              {sortKey === "name" &&
                (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
            </TableHead>
            <TableHead onClick={() => handleSort("email")}>
              Email
              {sortKey === "email" &&
                (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
            </TableHead>
            <TableHead onClick={() => handleSort("resourceTitle")}>
              Resource Title
              {sortKey === "resourceTitle" &&
                (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
            </TableHead>
            <TableHead>Price</TableHead>
            <TableHead onClick={() => handleSort("createdAt")}>
              Date
              {sortKey === "createdAt" &&
                (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.buyerName}</TableCell>
              <TableCell>{order.buyerEmail}</TableCell>
              <TableCell>{order.resourceTitle}</TableCell>
              <TableCell>$ {order.isFree ? "Free" : order.price}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger>
                    <Button variant={"outline"} className="">
                      <Notebook className="size-4 text-purple" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-white">
                    {order.note}
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() =>
                    handleUpdateOrderStatus(order._id, !order.delivered)
                  }
                  variant="outline"
                >
                  {order.delivered ? (
                    <CheckCircle className="size-4 text-green-500" />
                  ) : (
                    <Clock className="size-4 text-yellow-500" />
                  )}
                </Button>
                <Button
                  onClick={() => setConfirmDeleteId(order._id)}
                  variant={"outline"}
                  className="text-red-500"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {confirmDeleteId && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded">
            <h3>Are you sure you want to delete this order?</h3>
            <Button
              className="mt-2"
              variant="destructive"
              onClick={() => handleDeleteOrder(confirmDeleteId)}
            >
              Yes, Delete
            </Button>
            <Button
              className="mt-2"
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;

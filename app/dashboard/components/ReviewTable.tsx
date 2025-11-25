"use client";

import Image from "next/image";
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
import {
  Trash,
  SortAsc,
  SortDesc,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ReviewForm from "./ReviewForm";
import { IReview } from "@/lib/database/models/review.model";
import { deleteReview, updateReview } from "@/lib/actions/review.actions";
import { toast } from "react-hot-toast";

const ReviewTable = ({
  reviews,
  userId,
}: {
  reviews: Array<IReview>;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<
    "name" | "title" | "image" | "verified" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    const filtered = reviews.filter(
      (review) =>
        review.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valueA = a[sortKey].toString().toLowerCase();
        const valueB = b[sortKey].toString().toLowerCase();
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [reviews, searchQuery, sortKey, sortOrder]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleToggleVerified = async (review: IReview) => {
    try {
      await updateReview(review._id.toString(), { verified: !review.verified });
      toast.success("Review verification status updated");
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const handleSort = (key: "name" | "title" | "image" | "verified") => {
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
        placeholder="Search by name or title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full md:w-1/2 lg:w-1/3"
      />
      <Table className="border border-gray-200 rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReviews.map((review, index) => (
            <TableRow key={index}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{review.name}</TableCell>
              <TableCell>{review.title}</TableCell>
              <TableCell>
                <Button
                  variant={review.verified ? "default" : "outline"}
                  onClick={() => handleToggleVerified(review)}
                >
                  {review.verified ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                <Button
                  onClick={() => setConfirmDeleteId(review._id.toString())}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black-100 p-6 rounded-md space-y-4">
            <p>Are you sure you want to delete this review?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteReview(confirmDeleteId)}
                variant={"destructive"}
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

export default ReviewTable;

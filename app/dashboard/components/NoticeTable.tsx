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
import { Trash, SortAsc, SortDesc } from "lucide-react";
import { deleteBanner } from "@/lib/actions/banner.actions";

const NoticeTable = ({
  notices,
}: {
  notices: Array<{ _id: string; notice: string; }>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<"notice" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredNotices = useMemo(() => {
    const filtered = notices.filter(
      (admin) =>
        admin.notice.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valueA = a[sortKey].toLowerCase();
        const valueB = b[sortKey].toLowerCase();
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [notices, searchQuery, sortKey, sortOrder]);

  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(start, start + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  const handleDeleteBanner = async (noticeId: string) => {
    try {
      const response = await deleteBanner(noticeId);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete notice");
      console.log(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSort = (key: "notice" ) => {
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
        placeholder="Search by name or image"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full md:w-1/2 lg:w-1/3"
      />
      <Table className="border border-gray-200 rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("notice")}
                className="flex items-center gap-2"
              >
                Notice
                {sortKey === "notice" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedNotices.map((notice, index) => (
            <TableRow key={notice._id} className="hover:bg-gray-100">
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{notice.notice}</TableCell>

              <TableCell>
                <Button
                  onClick={() => setConfirmDeleteId(notice._id)}
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
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground line-clamp-1">
          Showing {Math.min(itemsPerPage * currentPage, filteredNotices.length)}{" "}
          of {filteredNotices.length} notices
        </span>
        <div className="flex items-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            size={"sm"}
          >
            Previous
          </Button>
          <Button
            disabled={
              currentPage === Math.ceil(filteredNotices.length / itemsPerPage)
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            size={"sm"}
          >
            Next
          </Button>
        </div>
      </div>
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md space-y-4">
            <p>Are you sure you want to delete this notice?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteBanner(confirmDeleteId)}
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

export default NoticeTable;

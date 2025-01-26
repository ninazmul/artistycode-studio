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
import { Trash, SortAsc, SortDesc, Clock, Check } from "lucide-react";
import {
  deleteRegistration,
  updateRegistration,
} from "@/lib/actions/registration.actions";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import RegistrationFrom from "./RegistrationForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { IRegistration } from "@/lib/database/models/registration.model";

const VolunteerTable = ({
  registrations,
}: {
  registrations: Array<IRegistration>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "email" | "status" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredRegistrations = useMemo(() => {
    const filtered = registrations.filter(
      (registration) =>
        registration.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        registration.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (sortKey) {
          case "name":
            valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
            valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case "email":
            valueA = a.email.toLowerCase();
            valueB = b.email.toLowerCase();
            break;
          case "status":
            valueA = a.status.toLowerCase();
            valueB = b.status.toLowerCase();
            break;
          default:
            return 0;
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [registrations, searchQuery, sortKey, sortOrder]);

  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(start, start + itemsPerPage);
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      const response = await deleteRegistration(registrationId);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete registration");
      console.log(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleToggleStatus = async (
    registrationId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "pending" ? "approved" : "pending";
      const response = await updateRegistration(registrationId, {
        status: newStatus,
      });
      if (response) {
        alert(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      alert("Failed to update status");
      console.log(error);
    }
  };

  const handleSort = (key: "name" | "email" | "status") => {
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
        placeholder="Search by name or email"
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
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 cursor-pointer"
              >
                Name
                {sortKey === "name" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("email")}
                className="flex items-center gap-2 cursor-pointer"
              >
                Email
                {sortKey === "email" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("status")}
                className="flex items-center gap-2 cursor-pointer"
              >
                Status
                {sortKey === "status" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRegistrations.map((registration, index) => (
            <TableRow key={registration._id} className="hover:bg-gray-100">
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/volunteers/${registration._id}`}
                  className="line-clamp-1 w-40 md:w-auto hover:underline"
                >
                  {registration.firstName} {registration.lastName}
                </Link>
              </TableCell>
              <TableCell>{registration.email}</TableCell>
              <TableCell>{registration.number}</TableCell>
              <TableCell>
                {formatDateTime(registration.date).dateOnly}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    handleToggleStatus(registration._id, registration.status)
                  }
                  variant={"outline"}
                  className={
                    (registration.status === "pending"
                      ? "text-yellow-500  bg-yellow-500/10"
                      : "text-primary-500 bg-primary-500/10") +
                    "font-semibold rounded-full"
                  }
                >
                  {registration.status === "pending" ? (
                    <>
                      <Clock />
                      <p>Pending</p>
                    </>
                  ) : (
                    <>
                      <Check />
                      <p>Approved</p>
                    </>
                  )}
                </Button>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                <Sheet>
                  <SheetTrigger>
                    <Button variant={"outline"} className="text-red-500">
                      <Image
                        src="/assets/icons/edit.svg"
                        alt="edit"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="bg-white">
                    <SheetHeader>
                      <SheetTitle>Update Volunteer Details</SheetTitle>
                      <SheetDescription>
                        Update information to ensure our records are accurate
                        and up to date. Please review and modify details as
                        needed, adhering to the system&apos;s requirements for
                        proper record management and organization.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-5">
                      <RegistrationFrom
                        userId={registration.userId}
                        registration={registration}
                        registrationId={registration?._id}
                        type="Update"
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  onClick={() => setConfirmDeleteId(registration._id)}
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
      <div className="flex justify-between items-center mt-4 w-full">
        <span className="text-sm text-muted-foreground line-clamp-1">
          Showing{" "}
          {Math.min(itemsPerPage * currentPage, filteredRegistrations.length)}{" "}
          of {filteredRegistrations.length} volunteers
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
              currentPage ===
              Math.ceil(filteredRegistrations.length / itemsPerPage)
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
            <p>Are you sure you want to delete this registration?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteRegistration(confirmDeleteId)}
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

export default VolunteerTable;

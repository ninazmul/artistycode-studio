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
import { Trash, SortAsc, SortDesc, Edit } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProjectForm from "./ProjectForm";
import { IProject } from "@/lib/database/models/project.model";
import { deleteProject } from "@/lib/actions/project.actions";

const ProjectTable = ({
  projects,
  userId,
  isAdmin,
}: {
  projects: Array<IProject>;
  userId: string;
  isAdmin: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<
    "category" | "title" | "image" | "stack" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const filtered = projects
      .filter((project) => {
        if (isAdmin) return true;
        return project.author === userId;
      })
      .filter(
        (project) =>
          project.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.image.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.stack.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [isAdmin, projects, searchQuery, sortKey, sortOrder, userId]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await deleteProject(projectId);
      if (response) {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete project");
      console.log(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSort = (key: "category" | "title" | "image" | "stack") => {
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
            <TableHead>
              <div
                onClick={() => handleSort("image")}
                className="flex items-center gap-2"
              >
                Image
                {sortKey === "image" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("category")}
                className="flex items-center gap-2"
              >
                Category
                {sortKey === "category" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("stack")}
                className="flex items-center gap-2"
              >
                Stack
                {sortKey === "stack" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => handleSort("title")}
                className="flex items-center gap-2"
              >
                Title
                {sortKey === "title" &&
                  (sortOrder === "asc" ? <SortAsc /> : <SortDesc />)}
              </div>
            </TableHead>

            <TableHead>Link</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProjects.map((project, index) => (
            <TableRow key={project._id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={50}
                  height={50}
                  className="object-cover rounded-md h-12 w-12"
                />
              </TableCell>
              <TableCell>{project.category}</TableCell>
              <TableCell className="line-clamp-1">{project.stack}</TableCell>
              <TableCell>{project.title}</TableCell>
              <TableCell>
                <Link
                  href={project.url}
                  target="_blank"
                  className="text-purple underline line-clamp-1"
                >
                  {project.url}
                </Link>
              </TableCell>
              <TableCell className="flex items-center space-x-2">
                <Sheet>
                  <SheetTrigger>
                    <Button variant={"outline"} className="text-purple-500">
                      <Edit />
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="backdrop-blur-md shadow-md">
                    <SheetHeader>
                      <SheetTitle>Update Project Details</SheetTitle>
                      <SheetDescription>
                        Update project information to ensure the library remains
                        accurate and up-to-date. Please review and modify the
                        details as needed, adhering to the system&apos;s
                        guidelines for proper project management and
                        organization.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-5">
                      <ProjectForm
                        userId={userId}
                        project={project}
                        projectId={project?._id}
                        type="Update"
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  onClick={() => setConfirmDeleteId(project._id)}
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
          Showing{" "}
          {Math.min(itemsPerPage * currentPage, filteredProjects.length)} of{" "}
          {filteredProjects.length} projects
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
              currentPage === Math.ceil(filteredProjects.length / itemsPerPage)
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
          <div className="bg-white text-black-100 p-6 rounded-md space-y-4">
            <p>Are you sure you want to delete this project?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteProject(confirmDeleteId)}
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

export default ProjectTable;

"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ResourceForm from "./ResourceForm";
import { deleteResource } from "@/lib/actions/resource.actions";
import { IResource } from "@/lib/database/models/resource.model";

const ResourceTable = ({
  resources,
  userId,
  isAdmin,
}: {
  resources: Array<IResource>;
  userId: string;
  isAdmin: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    return resources
      .filter((r) => (isAdmin ? true : r.author === userId))
      .filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.stack.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [resources, searchQuery, isAdmin, userId]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteResource(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search resources..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black border-white/20 text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left py-3">Resource</th>
              <th>Category</th>
              <th>Stack</th>
              <th>Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filteredResources.map((resource, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition align-middle"
              >
                {/* Resource */}
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={resource.image}
                      alt={resource.title}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover h-12 w-12"
                    />
                    <span className="line-clamp-1 truncate w-40 md:w-auto font-medium">
                      {resource.title}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="align-middle">
                  <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
                    {resource.category}
                  </span>
                </td>

                {/* Stack */}
                <td className="align-middle">
                  <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70 whitespace-nowrap">
                    {resource.stack}
                  </span>
                </td>

                {/* Price */}
                <td className="align-middle">
                  {resource.isFree ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      Free
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                      ${resource.price}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="text-right space-x-2 whitespace-nowrap">
                  {/* Edit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Resource</DialogTitle>
                      </DialogHeader>

                      <ResourceForm
                        userId={userId}
                        resource={resource}
                        resourceId={resource._id.toString()}
                        type="Update"
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(resource._id.toString())}
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
            <DialogTitle>Delete Resource</DialogTitle>
          </DialogHeader>

          <p className="text-white/70">
            Are you sure you want to delete this resource?
          </p>

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

export default ResourceTable;

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

  const handleDelete = async (id: string) => {
    await deleteResource(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search resources..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black/40 border-white/10 focus:border-white/30"
      />

      {/* Table Container */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 px-6 py-4 text-sm text-white/60 border-b border-white/10">
          <span>#</span>
          <span>Preview</span>
          <span>Category</span>
          <span>Stack</span>
          <span>Price</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filteredResources.map((resource, index) => (
          <div
            key={resource._id.toString()}
            className="grid grid-cols-6 items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 transition"
          >
            <span className="text-white/60">{index + 1}</span>

            <Image
              src={resource.image}
              alt={resource.title}
              width={60}
              height={40}
              className="rounded-md object-cover"
            />

            <span>{resource.category}</span>

            <span className="text-white/70">{resource.stack}</span>

            {/* Price Badge */}
            <span>
              {resource.isFree ? (
                <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Free
                </span>
              ) : (
                <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                  ${resource.price}
                </span>
              )}
            </span>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {/* Edit */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Edit size={16} />
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-black border border-white/10 text-white max-w-2xl">
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
                variant="ghost"
                className="text-red-400"
                onClick={() => setConfirmDeleteId(resource._id.toString())}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Resource?</DialogTitle>
          </DialogHeader>

          <p className="text-white/70 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmDeleteId!)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceTable;

"use client";

import { useState, useMemo } from "react";
import { deleteAdmin } from "@/lib/actions/admin.actions";
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
import AdminForm from "./AdminForm";

const AdminTable = ({
  admins,
  userId,
}: {
  admins: Array<{ _id: string; name: string; email: string }>;
  userId?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredAdmins = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lowerQuery) ||
        admin.email.toLowerCase().includes(lowerQuery),
    );
  }, [admins, searchQuery]);

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await deleteAdmin(adminId);
      if (response) alert(response.message);
    } catch (error) {
      alert("Failed to delete admin");
      console.error(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-black border-white/20 text-white"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left py-3">Name</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.map((admin, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition align-middle"
              >
                {/* name */}
                <td className="py-4 align-middle">
                  <div className="flex-1 space-y-1">
                    <p className="text-white font-semibold">{admin.name}</p>
                    <p className="text-white/70 text-sm">{admin.email}</p>
                  </div>
                </td>

                {/* Actions */}
                <td className="align-middle text-right">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(admin._id.toString())}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-md space-y-4 w-96">
            <p>Are you sure you want to delete this admin?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteAdmin(confirmDeleteId)}
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;

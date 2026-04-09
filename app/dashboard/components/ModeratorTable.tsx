"use client";

import { useState, useMemo } from "react";
import { deleteModerator } from "@/lib/actions/moderator.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
const ModeratorTable = ({
  moderators
}: {
  moderators: Array<{ _id: string; name: string; email: string }>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredModerators = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return moderators.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.email.toLowerCase().includes(lowerQuery),
    );
  }, [moderators, searchQuery]);

  const handleDeleteModerator = async (moderatorId: string) => {
    try {
      const response = await deleteModerator(moderatorId);
      if (response) alert(response.message);
    } catch (error) {
      alert("Failed to delete moderator");
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
            {filteredModerators.map((moderator, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition align-middle"
              >
                {/* name */}
                <td className="py-4 align-middle">
                  <div className="flex-1 space-y-1">
                    <p className="text-white font-semibold">{moderator.name}</p>
                    <p className="text-white/70 text-sm">{moderator.email}</p>
                  </div>
                </td>

                {/* Actions */}
                <td className="align-middle text-right">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(moderator._id.toString())}
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
            <p>Are you sure you want to delete this moderator?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteModerator(confirmDeleteId)}
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

export default ModeratorTable;

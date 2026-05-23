"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Edit, Mail } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import LeadForm from "./LeadForm";
import EmailDialog from "./EmailDialog";
import { deleteLead } from "@/lib/actions/lead.actions";
import toast from "react-hot-toast";

type LeadType = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: Date;
};

const LeadTable = ({
  leads,
  onRefresh,
}: {
  leads: Array<LeadType>;
  onRefresh: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Dialog controls
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Array<{
    _id: string;
    name: string;
    email: string;
    company?: string;
  }>>([]);

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        l.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leads, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLeads.map((l) => l._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteLead(confirmDeleteId);
      toast.success("Lead deleted successfully.");
      onRefresh();
      setConfirmDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete lead");
    }
  };

  const triggerBulkEmail = () => {
    const recipients = leads
      .filter((l) => selectedIds.includes(l._id))
      .map((l) => ({
        _id: l._id,
        name: l.name,
        email: l.email,
        company: l.company,
      }));
    setEmailRecipients(recipients);
    setIsEmailOpen(true);
  };

  const triggerSingleEmail = (lead: LeadType) => {
    setEmailRecipients([
      {
        _id: lead._id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
      },
    ]);
    setIsEmailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Replied":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "Emailed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black border-white/20 text-white max-w-md w-full"
        />

        {selectedIds.length > 0 && (
          <Button
            onClick={triggerBulkEmail}
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email to Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
        <table className="w-full text-sm text-left">
          <thead className="text-white/60 border-b border-white/10 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-4 px-4 w-12 text-center align-middle">
                <Checkbox
                  checked={
                    filteredLeads.length > 0 &&
                    selectedIds.length === filteredLeads.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
              </th>
              <th className="py-4 px-4 align-middle">Lead</th>
              <th className="py-4 px-4 align-middle">Company</th>
              <th className="py-4 px-4 align-middle">Status</th>
              <th className="py-4 px-4 align-middle">Date Added</th>
              <th className="py-4 px-4 text-right align-middle">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-white/50">
                  No leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-white/5 hover:bg-white/5 transition align-middle text-white/90"
                >
                  {/* Checkbox */}
                  <td className="py-4 px-4 text-center align-middle">
                    <Checkbox
                      checked={selectedIds.includes(lead._id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(lead._id, !!checked)
                      }
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </td>

                  {/* Contact Info */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{lead.name}</span>
                      <span className="text-xs text-white/50">{lead.email}</span>
                      {lead.notes && (
                        <span className="text-xs text-white/40 line-clamp-1 italic mt-0.5">
                          Note: {lead.notes}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 align-middle font-medium">
                    {lead.company || "—"}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 align-middle">
                    <span className={`px-2.5 py-0.5 text-xs rounded-full ${getStatusBadge(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 align-middle text-white/60">
                    {formatDateTime(lead.createdAt).dateOnly}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 align-middle text-right space-x-2 whitespace-nowrap">
                    {/* Quick Send Email */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => triggerSingleEmail(lead)}
                      className="border-white/10 hover:bg-white/10"
                    >
                      <Mail size={16} />
                    </Button>

                    {/* Edit Lead */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-white/10 hover:bg-white/10"
                        >
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Edit Lead Info</DialogTitle>
                        </DialogHeader>

                        <LeadForm
                          type="Update"
                          lead={lead}
                          onSuccess={onRefresh}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Delete Lead */}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setConfirmDeleteId(lead._id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
          </DialogHeader>

          <p className="text-white/70 text-sm">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Sender Dialog */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Compose Cold Email</DialogTitle>
          </DialogHeader>

          <EmailDialog
            selectedLeads={emailRecipients}
            onSuccess={() => {
              setSelectedIds([]);
              onRefresh();
            }}
            onClose={() => setIsEmailOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadTable;

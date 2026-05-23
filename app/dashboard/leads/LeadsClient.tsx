"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, Users, Mail, CheckCircle, Clock } from "lucide-react";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import { importLeadsAction, getAllLeads } from "@/lib/actions/lead.actions";
import * as XLSX from "xlsx";
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

const LeadsClient = ({ initialLeads }: { initialLeads: Array<LeadType> }) => {
  const [leads, setLeads] = useState<Array<LeadType>>(initialLeads);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeads = async () => {
    try {
      const updatedLeads = await getAllLeads();
      if (updatedLeads) {
        setLeads(updatedLeads);
      }
    } catch (err: any) {
      console.error("Failed to fetch leads", err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (rows.length < 2) {
          toast.error("File is empty or missing headers");
          return;
        }

        const headers = rows[0].map((h: any) => String(h).toLowerCase().trim());

        let nameIdx = headers.findIndex((h) => h.includes("name") || h === "lead" || h === "contact");
        let emailIdx = headers.findIndex((h) => h.includes("email") || h.includes("mail"));
        let companyIdx = headers.findIndex((h) => h.includes("company") || h.includes("org") || h.includes("business"));
        let notesIdx = headers.findIndex((h) => h.includes("note") || h.includes("desc") || h.includes("comment"));

        if (emailIdx === -1) {
          // Look in row 1 for any cell containing '@'
          const sampleRow = rows[1];
          if (sampleRow) {
            emailIdx = sampleRow.findIndex((cell) => String(cell).includes("@"));
          }
        }

        if (emailIdx === -1) {
          toast.error("Could not find an email column in the spreadsheet. Please verify headers.");
          return;
        }

        const parsedLeads = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const email = String(row[emailIdx] || "").trim();
          if (!email || !email.includes("@")) continue;

          const name = nameIdx !== -1 && row[nameIdx] ? String(row[nameIdx]).trim() : email.split("@")[0];
          const company = companyIdx !== -1 && row[companyIdx] ? String(row[companyIdx]).trim() : "";
          const notes = notesIdx !== -1 && row[notesIdx] ? String(row[notesIdx]).trim() : "";

          parsedLeads.push({
            name,
            email,
            company,
            notes,
            status: "Pending",
          });
        }

        if (parsedLeads.length === 0) {
          toast.error("No valid leads found in the spreadsheet.");
          return;
        }

        const loadingToast = toast.loading(`Importing ${parsedLeads.length} leads...`);

        const result = await importLeadsAction(parsedLeads);
        toast.dismiss(loadingToast);

        if (result?.success) {
          toast.success(`Successfully imported/updated ${parsedLeads.length} leads!`);
          fetchLeads();
        } else {
          toast.error("Import failed.");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to parse file");
      }
    };

    fileReader.readAsBinaryString(file);
    e.target.value = ""; // Reset
  };

  // Stats calculation
  const totalLeads = leads.length;
  const emailedLeads = leads.filter((l) => l.status === "Emailed").length;
  const pendingLeads = leads.filter((l) => l.status === "Pending").length;
  const repliedLeads = leads.filter((l) => l.status === "Replied").length;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            Leads Management
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Import spreadsheets, enter details manually, and launch personalized cold email outreach.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <Button
            onClick={handleImportClick}
            variant="outline"
            className="border-white/10 hover:bg-white/10 text-white flex items-center gap-2"
          >
            <Upload size={16} />
            Import CSV/Excel
          </Button>

          {/* Add Manual Lead Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black border border-white/20 transition-all flex items-center gap-2">
                <Plus size={16} />
                Add Lead Manually
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border border-white/10 backdrop-blur-xl max-w-md text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Lead</DialogTitle>
              </DialogHeader>

              <div className="pt-4">
                <LeadForm
                  type="Create"
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    fetchLeads();
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Total Leads</p>
              <p className="text-2xl font-bold mt-1 text-white">{totalLeads}</p>
            </div>
          </div>
        </Card>

        {/* Pending */}
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-zinc-500/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <Clock className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Pending Outreach</p>
              <p className="text-2xl font-bold mt-1 text-white">{pendingLeads}</p>
            </div>
          </div>
        </Card>

        {/* Emailed */}
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Emailed Leads</p>
              <p className="text-2xl font-bold mt-1 text-white">{emailedLeads}</p>
            </div>
          </div>
        </Card>

        {/* Replied */}
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-emerald-500/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Replied Leads</p>
              <p className="text-2xl font-bold mt-1 text-white">{repliedLeads}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <LeadTable leads={leads} onRefresh={fetchLeads} />
      </div>
    </div>
  );
};

export default LeadsClient;

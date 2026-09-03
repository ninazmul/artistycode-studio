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
import { Plus, Upload, Users, Mail, CheckCircle, Clock, Download } from "lucide-react";
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

  const downloadSampleTemplate = () => {
    try {
      const sampleData = [
        {
          "Name": "John Doe",
          "Email": "john.doe@example.com",
          "Company": "Acme Corp",
          "Notes": "Met at TechConf. Follow up about design."
        },
        {
          "Name": "Jane Smith",
          "Email": "jane.smith@example.com",
          "Company": "Innovate LLC",
          "Notes": "Interested in custom software development."
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();

      // Set column widths to ensure readable layout
      worksheet["!cols"] = [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 25 }, // Company
        { wch: 45 }  // Notes
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Template");
      XLSX.writeFile(workbook, "leads_import_template.xlsx");
      toast.success("Sample template downloaded successfully!");
    } catch (err: any) {
      console.error("Failed to download template", err);
      toast.error("Failed to generate sample template");
    }
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Core</p>
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-sm text-white/40 mt-1">
            Import spreadsheets, add manually, and launch personalized cold outreach.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <Button
            onClick={downloadSampleTemplate}
            variant="ghost"
            className="gap-2 text-white/50 hover:text-white hover:bg-white/[0.06] border border-white/10 rounded-xl h-9 px-4 text-sm"
          >
            <Download size={14} />
            Template
          </Button>
          <Button
            onClick={handleImportClick}
            variant="ghost"
            className="gap-2 text-white/50 hover:text-white hover:bg-white/[0.06] border border-white/10 rounded-xl h-9 px-4 text-sm"
          >
            <Upload size={14} />
            Import
          </Button>

          {/* Add Manual Lead Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-4 h-9 text-sm font-medium transition-all">
                <Plus size={14} />
                Add Lead
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-md text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Add New Lead</DialogTitle>
                <p className="text-white/40 text-sm mt-1">Manually add a new lead to your pipeline.</p>
              </DialogHeader>

              <div className="mt-4">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] hover:bg-[#111] transition-colors p-5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-white/50" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{totalLeads}</p>
          <p className="text-xs text-white/30 mt-0.5">Total Leads</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] hover:bg-[#111] transition-colors p-5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{pendingLeads}</p>
          <p className="text-xs text-white/30 mt-0.5">Pending</p>
        </div>

        <div className="rounded-2xl border border-blue-500/[0.12] bg-[#0d0d0d] hover:bg-[#111] transition-colors p-5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{emailedLeads}</p>
          <p className="text-xs text-white/30 mt-0.5">Emailed</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/[0.12] bg-[#0d0d0d] hover:bg-[#111] transition-colors p-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{repliedLeads}</p>
          <p className="text-xs text-white/30 mt-0.5">Replied</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
          All Leads ({leads.length})
        </p>
        <LeadTable leads={leads} onRefresh={fetchLeads} />
      </div>
    </div>
  );
};

export default LeadsClient;

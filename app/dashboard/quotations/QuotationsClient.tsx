"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  FileCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import QuotationForm from "../components/QuotationForm";
import QuotationTable from "../components/QuotationTable";
import { auditOverdueInvoices } from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface QuotationsClientProps {
  initialQuotations: any[];
  userId: string;
}

export default function QuotationsClient({
  initialQuotations,
  userId,
}: QuotationsClientProps) {
  const router = useRouter();
  const [quotations, setQuotations] = useState<any[]>(initialQuotations);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // Compute KPI metrics
  let totalPipelineValue = 0;
  let signedCount = 0;
  let overdueInvoicesCount = 0;
  let totalLateFees = 0;

  for (const q of quotations) {
    totalPipelineValue += Number(q.totalBudget || 0);
    if (q.status === "Signed" || q.status === "Active" || q.status === "Completed") {
      signedCount++;
    }
    for (const inv of q.invoices || []) {
      if (inv.status === "Overdue") {
        overdueInvoicesCount++;
      }
      totalLateFees += Number(inv.lateFeeAmount || 0);
    }
  }

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await auditOverdueInvoices();
      if (res) {
        toast.success(
          `Audit complete! Audited ${res.auditedQuotations} quotes, updated ${res.penaltiesApplied} penalties, sent ${res.warningsSent} warnings.`
        );
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to run audit.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">
            Revenue & Contracts
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Quotations & Agreements</h1>
          <p className="text-sm text-white/40 mt-1">
            Generate project quotes, send live-sign contracts, and automate 30%/40%/30% milestone invoicing.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAudit}
            disabled={isAuditing}
            variant="outline"
            className="gap-2 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 px-4 text-xs font-medium"
            title="Scan deadlines, apply 2% late fee penalty every 7 days, and dispatch overdue warnings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? "Auditing..." : "Audit Late Fees & Deadlines"}
          </Button>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                <Plus className="w-4 h-4" />
                New Quotation
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#0c0c0c] border border-white/10 rounded-3xl max-w-2xl text-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Generate Project Quotation</DialogTitle>
                <p className="text-white/40 text-xs mt-1">
                  Specify features, budget, and milestone deadlines. This automatically formats the 30%/40%/30% invoices.
                </p>
              </DialogHeader>

              <div className="mt-4">
                <QuotationForm
                  userId={userId}
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    router.refresh();
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
            <DollarSign className="w-4 h-4 text-white/50" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-white">
            ${totalPipelineValue.toLocaleString()}
          </p>
          <p className="text-xs text-white/30 mt-0.5">Total Pipeline Value</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/[0.15] bg-[#0d0d0d] p-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-400">
            {signedCount}
          </p>
          <p className="text-xs text-white/30 mt-0.5">Signed Agreements</p>
        </div>

        <div className="rounded-2xl border border-red-500/[0.15] bg-[#0d0d0d] p-5">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-red-400">
            {overdueInvoicesCount}
          </p>
          <p className="text-xs text-white/30 mt-0.5">Overdue Invoices</p>
        </div>

        <div className="rounded-2xl border border-amber-500/[0.15] bg-[#0d0d0d] p-5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-amber-400">
            +${totalLateFees.toLocaleString()}
          </p>
          <p className="text-xs text-white/30 mt-0.5">Accrued 2% Late Fees</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
          All Quotations & Agreements ({quotations.length})
        </p>
        <QuotationTable
          quotations={quotations}
          onRefresh={() => router.refresh()}
        />
      </div>
    </div>
  );
}

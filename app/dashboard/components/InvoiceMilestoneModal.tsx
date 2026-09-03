"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mail,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import { sendMilestoneInvoice, markInvoiceAsPaid } from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";

interface InvoiceMilestoneModalProps {
  quotation: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export default function InvoiceMilestoneModal({
  quotation,
  open,
  onOpenChange,
  onRefresh,
}: InvoiceMilestoneModalProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  if (!quotation) return null;

  const currSymbol = quotation.currency === "BDT" ? "৳" : "$";

  const handleSendEmail = async (mIndex: number) => {
    setLoadingIndex(mIndex);
    try {
      const res = await sendMilestoneInvoice(quotation._id, mIndex);
      if (res?.success) {
        toast.success(`Invoice #${mIndex + 1} sent to ${quotation.clientEmail}!`);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send invoice email.");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleMarkPaid = async (mIndex: number) => {
    setLoadingIndex(mIndex);
    try {
      const res = await markInvoiceAsPaid(quotation._id, mIndex);
      if (res?.success) {
        toast.success(`Invoice #${mIndex + 1} marked as PAID. Success receipt emailed to client!`);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark invoice as paid.");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c0c0c] border border-white/10 rounded-3xl max-w-2xl text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{quotation.quotationNumber}</span>
            <span>•</span>
            <span>{quotation.companyName || quotation.clientName}</span>
          </div>
          <DialogTitle className="text-white text-lg font-bold">
            Manage Milestone Invoices (30% • 40% • 30%)
          </DialogTitle>
          <p className="text-xs text-white/50 mt-1">
            Track deliveries, trigger milestone emails, calculate 2% late fees, and issue payment receipts.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {quotation.invoices?.map((inv: any, idx: number) => {
            const isPaid = inv.status === "Paid";
            const isOverdue = inv.status === "Overdue";
            const isLoading = loadingIndex === idx;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isPaid
                    ? "bg-emerald-950/15 border-emerald-500/30"
                    : isOverdue
                    ? "bg-red-950/20 border-red-500/30"
                    : "bg-white/[0.02] border-white/[0.07]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        Milestone {idx + 1} ({inv.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isPaid
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : isOverdue
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mt-1">{inv.title}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-white tabular-nums">
                      {currSymbol}{inv.totalDue?.toLocaleString()}
                    </p>
                    {inv.lateFeeAmount > 0 && (
                      <p className="text-[11px] text-red-400 font-medium">
                        +{currSymbol}{inv.lateFeeAmount.toLocaleString()} late fee ({inv.lateFeePercentage}%)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs">
                  <div className="space-y-0.5 text-white/40">
                    <p>Due Deadline: <span className="text-white/80">{new Date(inv.deadline).toLocaleDateString()}</span></p>
                    {inv.paidAt && (
                      <p className="text-emerald-400 font-medium">
                        Paid on: {new Date(inv.paidAt).toLocaleDateString()}
                      </p>
                    )}
                    {inv.lastReminderSentAt && (
                      <p className="text-[10px]">
                        Last Notification: {new Date(inv.lastReminderSentAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 text-xs border-white/10 hover:bg-white/10 text-white rounded-lg gap-1"
                    >
                      <a href={`/invoice/${quotation._id}/${idx + 1}`} target="_blank">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                    </Button>

                    {!isPaid && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSendEmail(idx)}
                          disabled={isLoading}
                          variant="ghost"
                          className="h-8 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-lg gap-1.5"
                        >
                          <Mail className="w-3 h-3" />
                          Send Invoice Email
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleMarkPaid(idx)}
                          disabled={isLoading}
                          className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg gap-1.5 font-medium"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark as Paid
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

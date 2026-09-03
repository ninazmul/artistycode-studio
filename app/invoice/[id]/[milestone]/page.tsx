import { getQuotationById } from "@/lib/actions/quotation.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, CheckCircle2, Clock, AlertOctagon } from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ id: string; milestone: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { id, milestone } = await params;
  try {
    const quotation = await getQuotationById(id);
    const mIndex = parseInt(milestone) - 1;
    const inv = quotation?.invoices?.[mIndex];
    return {
      title: `${inv?.invoiceNumber || "Invoice"} — ArtistyCode Studio`,
    };
  } catch {
    return { title: "Invoice — ArtistyCode Studio" };
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id, milestone } = await params;
  const mIndex = parseInt(milestone) - 1;

  if (isNaN(mIndex) || mIndex < 0 || mIndex > 2) {
    notFound();
  }

  const quotation = await getQuotationById(id);
  if (!quotation || !quotation.invoices?.[mIndex]) {
    notFound();
  }

  const invoice = quotation.invoices[mIndex];
  const currSymbol = quotation.currency === "BDT" ? "৳" : "$";
  const isPaid = invoice.status === "Paid";
  const isOverdue = invoice.status === "Overdue";

  return (
    <div className="min-h-screen bg-[#080808] text-white py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:p-0">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href={`/agreement/${quotation._id}`}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Agreement
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // Handled via Client Action or window.print in a wrapper
              }}
              asChild
              className="gap-2 border-white/10 hover:bg-white/10 text-white text-xs h-9 rounded-xl"
            >
              <a href="javascript:window.print()">
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </a>
            </Button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="relative rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-8 sm:p-12 shadow-2xl backdrop-blur-xl print:border-none print:p-0 print:bg-transparent">
          {/* Status Watermark */}
          {isPaid && (
            <div className="absolute top-8 right-8 rotate-12 border-2 border-emerald-500/40 text-emerald-400 font-bold px-4 py-1 rounded-xl text-sm uppercase tracking-widest bg-emerald-500/10">
              PAID IN FULL
            </div>
          )}
          {isOverdue && (
            <div className="absolute top-8 right-8 rotate-12 border-2 border-red-500/40 text-red-400 font-bold px-4 py-1 rounded-xl text-sm uppercase tracking-widest bg-red-500/10">
              OVERDUE
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/[0.08] pb-8 print:border-black/20">
            <div>
              <Image
                src="/assets/images/logo.png"
                width={150}
                height={38}
                alt="ArtistyCode Studio"
                className="opacity-90 mb-4 print:invert"
              />
              <p className="text-xs text-white/40 print:text-black/60">
                ArtistyCode Studio<br />
                Official Hostinger Cloud Partner<br />
                contact@artistycode.studio • artistycode.studio
              </p>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-2xl font-bold text-white tracking-tight print:text-black">
                INVOICE
              </h1>
              <p className="text-xs font-mono text-white/60 mt-1 print:text-black/70">
                {invoice.invoiceNumber}
              </p>
              <div className="mt-4 space-y-1 text-xs">
                <p className="text-white/40 print:text-black/60">
                  Issue Date: <span className="text-white print:text-black font-medium">{new Date(quotation.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="text-white/40 print:text-black/60">
                  Due Date: <span className="text-amber-400 print:text-black font-semibold">{new Date(invoice.deadline).toLocaleDateString()}</span>
                </p>
                {invoice.paidAt && (
                  <p className="text-emerald-400 font-medium">
                    Paid Date: {new Date(invoice.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="py-6 border-b border-white/[0.08] print:border-black/20">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 print:text-black/50">
              BILLED TO:
            </span>
            <p className="font-semibold text-white mt-1 print:text-black text-sm">{quotation.clientName}</p>
            <p className="text-xs text-white/60 print:text-black/70">{quotation.companyName}</p>
            <p className="text-xs text-white/40 print:text-black/60">{quotation.clientEmail}</p>
            <p className="text-xs text-white/40 mt-1 print:text-black/60">
              Project: <span className="text-white print:text-black font-medium">{quotation.title}</span>
            </p>
          </div>

          {/* Line Items */}
          <div className="py-6 border-b border-white/[0.08] print:border-black/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/30 uppercase tracking-wider print:border-black/20 print:text-black/60">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-center pb-2">Allocation</th>
                  <th className="text-right pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] print:divide-black/10">
                <tr>
                  <td className="py-4">
                    <p className="font-semibold text-white text-sm print:text-black">{invoice.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 print:text-black/60">
                      Deliverables for {quotation.title} — Milestone {mIndex + 1}
                    </p>
                  </td>
                  <td className="py-4 text-center font-medium text-white/60 print:text-black/80">
                    {invoice.percentage}%
                  </td>
                  <td className="py-4 text-right font-semibold text-white tabular-nums text-sm print:text-black">
                    {currSymbol}{invoice.baseAmount.toLocaleString()}
                  </td>
                </tr>

                {invoice.lateFeeAmount > 0 && (
                  <tr>
                    <td className="py-3 text-red-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Accrued Late Fee Penalty ({invoice.lateFeePercentage}%)
                      </div>
                      <span className="text-[11px] text-red-300/70">
                        2% assessed per 7-day period past deadline
                      </span>
                    </td>
                    <td className="py-3 text-center text-red-400 font-medium">
                      +{invoice.lateFeePercentage}%
                    </td>
                    <td className="py-3 text-right font-bold text-red-400 tabular-nums">
                      +{currSymbol}{invoice.lateFeeAmount.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary / Total */}
          <div className="py-6 border-b border-white/[0.08] flex justify-end print:border-black/20">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-white/50 print:text-black/70">
                <span>Base Subtotal:</span>
                <span className="tabular-nums text-white print:text-black">{currSymbol}{invoice.baseAmount.toLocaleString()}</span>
              </div>
              {invoice.lateFeeAmount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Late Fee ({invoice.lateFeePercentage}%):</span>
                  <span className="tabular-nums font-semibold">+{currSymbol}{invoice.lateFeeAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/[0.08] pt-2 print:text-black print:border-black/20">
                <span>Total Due:</span>
                <span className={`tabular-nums text-base ${isPaid ? "text-emerald-400" : isOverdue ? "text-red-400" : "text-emerald-400"}`}>
                  {currSymbol}{invoice.totalDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="pt-6 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 print:text-black/50">
              PAYMENT METHODS & SETTLEMENT:
            </span>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/60 space-y-1.5 print:bg-transparent print:border-black/10 print:text-black/80">
              <p>• <strong>Bank Wire / Transfer:</strong> Please reply to your invoice email for international SWIFT/IBAN instructions.</p>
              <p>• <strong>Bangladesh Local:</strong> bKash / Nagad / City Bank details available upon request.</p>
              <p>• <strong>Online Payment:</strong> Contact billing@artistycode.studio for credit card or Stripe checkout link.</p>
              <p className="text-[11px] text-white/30 pt-1 print:text-black/50">
                After settlement, please reply with transaction receipt/proof for immediate verification.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/25 print:hidden">
          ArtistyCode Studio • Official Tax & Invoice Document
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { signAgreement } from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";

interface AgreementClientProps {
  quotation: any;
}

export default function AgreementClient({ quotation }: AgreementClientProps) {
  const isSigned = quotation.status === "Signed" || quotation.status === "Active" || quotation.status === "Completed";

  // Signature pad states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState(quotation.clientName || "");
  const [signerEmail, setSignerEmail] = useState(quotation.clientEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup canvas drawing context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#38bdf8"; // cyan-blue digital ink
    ctx.lineWidth = 2.5;
  }, [isSigned]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSign = async () => {
    if (!hasDrawn || !canvasRef.current) {
      toast.error("Please draw your signature before submitting.");
      return;
    }
    if (!signerName.trim() || !signerEmail.trim()) {
      toast.error("Please provide your full legal name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const signatureDataUrl = canvasRef.current.toDataURL("image/png");
      const res = await signAgreement({
        quotationId: quotation._id,
        signedByName: signerName.trim(),
        signerEmail: signerEmail.trim(),
        signatureDataUrl,
      });

      if (res?.success) {
        toast.success("Agreement signed! Kickoff invoice sent to your email.");
        window.location.reload();
      } else {
        toast.error(res?.message || "Failed to submit signature.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while signing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currSymbol = quotation.currency === "BDT" ? "৳" : "$";

  return (
    <div className="min-h-screen bg-[#070707] text-white py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:p-0">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between print:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/logo.png"
              width={140}
              height={36}
              alt="ArtistyCode Studio"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="gap-2 border-white/10 hover:bg-white/10 text-white text-xs h-9 rounded-xl"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </Button>
        </div>

        {/* Main Document Card */}
        <div className="relative rounded-3xl border border-white/[0.08] bg-[#0c0c0c] p-6 sm:p-10 shadow-2xl backdrop-blur-xl print:border-none print:p-0 print:bg-transparent">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/[0.08] pb-8 print:border-black/20">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-emerald-400">
                Official Project Proposal & Agreement
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1 print:text-black">
                {quotation.title}
              </h1>
              <p className="text-xs text-white/40 mt-1 print:text-black/60">
                Prepared by ArtistyCode Studio for {quotation.companyName || quotation.clientName}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide border flex items-center gap-1.5 w-fit">
                {isSigned ? (
                  <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Legally Executed
                  </span>
                ) : (
                  <span className="text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Signature
                  </span>
                )}
              </div>
              <span className="text-xs text-white/30 font-mono print:text-black/40">
                Quote ID: {quotation.quotationNumber}
              </span>
              <span className="text-xs text-white/30 print:text-black/40">
                Date: {new Date(quotation.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Client & Studio Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-b border-white/[0.08] print:border-black/20 text-sm">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] print:bg-transparent print:border-black/10">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 print:text-black/50">
                CLIENT INFORMATION
              </span>
              <p className="font-semibold text-white mt-1 print:text-black">{quotation.clientName}</p>
              <p className="text-white/60 text-xs mt-0.5 print:text-black/70">{quotation.companyName}</p>
              <p className="text-white/40 text-xs mt-0.5 print:text-black/60">{quotation.clientEmail}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] print:bg-transparent print:border-black/10">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 print:text-black/50">
                SERVICE PROVIDER
              </span>
              <p className="font-semibold text-white mt-1 print:text-black">ArtistyCode Studio</p>
              <p className="text-white/60 text-xs mt-0.5 print:text-black/70">contact@artistycode.studio</p>
              <p className="text-white/40 text-xs mt-0.5 print:text-black/60">Official Hostinger Cloud Partner</p>
            </div>
          </div>

          {/* Scope & Features Breakdown */}
          <div className="py-8 border-b border-white/[0.08] print:border-black/20 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 print:text-black">
              <FileText className="w-4 h-4 text-emerald-400" />
              Project Deliverables & Features Scope
            </h2>

            <div className="space-y-3">
              {quotation.features?.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-start justify-between gap-3 print:bg-transparent print:border-black/10"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white/80 print:text-black">
                      {idx + 1}. {f.title}
                    </span>
                    <p className="text-xs text-white/50 leading-relaxed print:text-black/70">
                      {f.description}
                    </p>
                  </div>
                  {f.estimatedDays && (
                    <span className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full whitespace-nowrap self-start">
                      Est. {f.estimatedDays} Days
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Payment Structure (30% / 40% / 30%) */}
          <div className="py-8 border-b border-white/[0.08] print:border-black/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight print:text-black">
                Payment Schedule (30% • 40% • 30%)
              </h2>
              <div className="text-right">
                <span className="text-xs text-white/40 print:text-black/60">Total Contract Value: </span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">
                  {currSymbol}{quotation.totalBudget?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quotation.invoices?.map((inv: any, i: number) => {
                const isPaid = inv.status === "Paid";
                const isOverdue = inv.status === "Overdue";
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPaid
                        ? "bg-emerald-950/10 border-emerald-500/30"
                        : isOverdue
                        ? "bg-red-950/15 border-red-500/30"
                        : "bg-white/[0.02] border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 print:text-black/50">
                        Invoice {i + 1} ({inv.percentage}%)
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

                    <p className="text-xs font-semibold text-white/90 line-clamp-1 print:text-black">
                      {inv.title}
                    </p>

                    <div className="my-3">
                      <p className="text-xl font-bold text-white tabular-nums print:text-black">
                        {currSymbol}{inv.totalDue?.toLocaleString()}
                      </p>
                      {inv.lateFeeAmount > 0 && (
                        <p className="text-[11px] text-red-400 font-medium">
                          +{currSymbol}{inv.lateFeeAmount.toLocaleString()} late fee ({inv.lateFeePercentage}%)
                        </p>
                      )}
                    </div>

                    <p className="text-[11px] text-white/40 print:text-black/60">
                      Due: {new Date(inv.deadline).toLocaleDateString()}
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/[0.05] flex justify-between items-center text-xs">
                      <Link
                        href={`/invoice/${quotation._id}/${i + 1}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Invoice
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Late Fee Notice Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                <strong>Late Fee Penalty Policy:</strong> Payments are due on the stated deadline. Invoices remaining unpaid after a 7-day grace period accrue an automatic <strong>2% late fee penalty for every 7 days overdue</strong> until settled.
              </p>
            </div>
          </div>

          {/* Legal Agreement Terms */}
          <div className="py-8 border-b border-white/[0.08] print:border-black/20 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight print:text-black">
              Standard Terms & Conditions
            </h2>
            <div className="text-xs text-white/60 leading-relaxed space-y-2 whitespace-pre-line p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] print:bg-transparent print:border-black/10 print:text-black/80">
              {quotation.agreementText}
            </div>
          </div>

          {/* Signature Section */}
          <div className="pt-8">
            <h2 className="text-lg font-bold text-white tracking-tight mb-4 print:text-black">
              Authorization & Acceptance
            </h2>

            {isSigned ? (
              /* Already Signed View */
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:border-black/30 print:bg-transparent">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Agreement Legally Signed & Verified
                  </div>
                  <p className="text-xs text-white/70 print:text-black">
                    Signed by: <strong>{quotation.signature?.signedByName}</strong> ({quotation.signature?.signerEmail})
                  </p>
                  <p className="text-[11px] text-white/40 print:text-black/60">
                    Timestamp: {quotation.signature?.signedAt ? new Date(quotation.signature.signedAt).toUTCString() : "Verified"}
                  </p>
                </div>

                {quotation.signature?.signatureDataUrl && (
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 print:bg-transparent print:border-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={quotation.signature.signatureDataUrl}
                      alt="Digital Signature"
                      className="h-16 w-48 object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Live Signature Pad */
              <div className="space-y-5 print:hidden">
                <p className="text-xs text-white/50 leading-relaxed">
                  By signing below, you agree on behalf of <strong>{quotation.companyName || quotation.clientName}</strong> to the project scope, 30%/40%/30% milestone payment structure, and terms of service.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 font-medium block mb-1">
                      Full Legal Name
                    </label>
                    <Input
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 font-medium block mb-1">
                      Signer Email Address
                    </label>
                    <Input
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-white/50 font-medium">
                      Draw Your Signature with mouse or finger
                    </label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-[#050505] overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-36 cursor-crosshair touch-none"
                    />
                  </div>
                  <span className="text-[11px] text-white/30 mt-1 block">
                    Your digital signature is recorded with timestamp and cryptographic integrity.
                  </span>
                </div>

                <Button
                  onClick={handleSign}
                  disabled={isSubmitting || !hasDrawn}
                  className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-semibold text-sm transition-all shadow-lg shadow-white/10 disabled:opacity-30"
                >
                  {isSubmitting ? "Executing Agreement..." : "Authorize & Sign Agreement →"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-white/25 print:hidden">
          ArtistyCode Studio • Powered by Secure Digital Contracts • All Rights Reserved
        </div>
      </div>
    </div>
  );
}

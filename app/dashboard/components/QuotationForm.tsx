"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Sparkles } from "lucide-react";
import { createQuotation } from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";

interface QuotationFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export default function QuotationForm({ userId, onSuccess }: QuotationFormProps) {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("Custom Web Application");
  const [currency, setCurrency] = useState<"USD" | "BDT">("USD");
  const [totalBudget, setTotalBudget] = useState<string>("");

  // Default deadlines: 7 days for kickoff, 30 days for mid, 60 days for final
  const today = new Date();
  const d1 = new Date(today);
  d1.setDate(d1.getDate() + 7);
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 30);
  const d3 = new Date(today);
  d3.setDate(d3.getDate() + 60);

  const [milestone1Deadline, setMilestone1Deadline] = useState(d1.toISOString().split("T")[0]);
  const [milestone2Deadline, setMilestone2Deadline] = useState(d2.toISOString().split("T")[0]);
  const [milestone3Deadline, setMilestone3Deadline] = useState(d3.toISOString().split("T")[0]);

  const [features, setFeatures] = useState<
    { title: string; description: string; estimatedDays?: number }[]
  >([
    {
      title: "UI/UX & Interactive Design System",
      description: "Modern obsidian luxury agency design with responsive layout, custom typography, and animations.",
      estimatedDays: 7,
    },
    {
      title: "Full-Stack Core Architecture & APIs",
      description: "Next.js 16 server actions, database schema modeling, authentication, and core business workflows.",
      estimatedDays: 14,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", estimatedDays: 5 }]);
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const updateFeature = (idx: number, field: string, val: any) => {
    const updated = [...features];
    updated[idx] = { ...updated[idx], [field]: val };
    setFeatures(updated);
  };

  const budgetNum = Number(totalBudget) || 0;
  const m1Amount = Math.round(budgetNum * 0.3);
  const m2Amount = Math.round(budgetNum * 0.4);
  const m3Amount = budgetNum - m1Amount - m2Amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !clientName.trim() || !clientEmail.trim() || !companyName.trim()) {
      toast.error("Please fill in project title, client name, email, and company.");
      return;
    }

    if (budgetNum <= 0) {
      toast.error("Please specify a valid total project budget.");
      return;
    }

    if (features.length === 0 || features.some((f) => !f.title.trim())) {
      toast.error("Please add at least one feature deliverable with a title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createQuotation({
        title: title.trim(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        companyName: companyName.trim(),
        category,
        currency,
        totalBudget: budgetNum,
        features,
        milestone1Deadline: new Date(milestone1Deadline),
        milestone2Deadline: new Date(milestone2Deadline),
        milestone3Deadline: new Date(milestone3Deadline),
        createdBy: userId || "Admin",
      });

      if (res) {
        toast.success("Quotation & Agreement generated! Email sent to client.");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to create quotation.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currSymbol = currency === "BDT" ? "৳" : "$";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-sm text-white">
      {/* Basic Client Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Project Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fintech SaaS Portal & Admin Suite"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10"
            required
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Company / Organization</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Apex Global Tech Ltd"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Client Full Name</label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. John Doe"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10"
            required
          />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Client Email Address</label>
          <Input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="john@company.com"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10"
            required
          />
        </div>
      </div>

      {/* Budget & Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full bg-[#0c0c0c] border border-white/10 text-white rounded-xl h-10 px-3 text-sm focus:border-white/30"
          >
            <option value="USD">USD ($)</option>
            <option value="BDT">BDT (৳)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-white/50 block mb-1">Total Project Budget</label>
          <Input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            placeholder="e.g. 2500"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10"
            required
          />
        </div>
      </div>

      {/* Live 30% / 40% / 30% Milestone Breakdown Preview */}
      {budgetNum > 0 && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Automated 30% • 40% • 30% Milestone Breakdown
          </span>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase block">Kickoff (30%)</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {currSymbol}{m1Amount.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase block">Midpoint (40%)</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {currSymbol}{m2Amount.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase block">Delivery (30%)</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {currSymbol}{m3Amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Deadlines */}
      <div className="space-y-2">
        <label className="text-xs text-white/50 block font-medium">
          Milestone Payment Deadlines
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-white/40 block mb-1">Invoice 1: 30% Kickoff</span>
            <Input
              type="date"
              value={milestone1Deadline}
              onChange={(e) => setMilestone1Deadline(e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10 text-xs"
              required
            />
          </div>
          <div>
            <span className="text-[10px] text-white/40 block mb-1">Invoice 2: 40% Midpoint</span>
            <Input
              type="date"
              value={milestone2Deadline}
              onChange={(e) => setMilestone2Deadline(e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10 text-xs"
              required
            />
          </div>
          <div>
            <span className="text-[10px] text-white/40 block mb-1">Invoice 3: 30% Final Delivery</span>
            <Input
              type="date"
              value={milestone3Deadline}
              onChange={(e) => setMilestone3Deadline(e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-10 text-xs"
              required
            />
          </div>
        </div>
      </div>

      {/* Feature Items Scope Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white/50 block font-medium">
            Project Features & Deliverables Scope
          </label>
          <Button
            type="button"
            onClick={addFeature}
            variant="outline"
            className="h-8 text-xs border-white/10 hover:bg-white/10 text-white rounded-lg gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Feature
          </Button>
        </div>

        <div className="space-y-3">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 relative"
            >
              <div className="flex items-center gap-2">
                <Input
                  value={f.title}
                  onChange={(e) => updateFeature(idx, "title", e.target.value)}
                  placeholder={`Feature ${idx + 1} Name (e.g. Real-Time Chat & Push Notifications)`}
                  className="bg-white/[0.03] border-white/10 text-white rounded-xl h-9 text-xs flex-1"
                />
                <Input
                  type="number"
                  value={f.estimatedDays || ""}
                  onChange={(e) => updateFeature(idx, "estimatedDays", Number(e.target.value))}
                  placeholder="Est. Days"
                  className="bg-white/[0.03] border-white/10 text-white rounded-xl h-9 text-xs w-24"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Textarea
                value={f.description}
                onChange={(e) => updateFeature(idx, "description", e.target.value)}
                placeholder="Scope description and key technical deliverables..."
                className="bg-white/[0.03] border-white/10 text-white rounded-xl text-xs min-h-[50px]"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-white text-black hover:bg-white/90 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-white/10"
      >
        {isSubmitting ? "Generating Quotation & Contract..." : "Generate & Send Quotation Plan →"}
      </Button>
    </form>
  );
}

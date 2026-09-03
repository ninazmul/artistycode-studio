import { getDashboardSummary } from "@/lib/actions/dashboard.actions";
import DashboardClient from "./components/DashboardClient";
import {
  CodeIcon,
  FilesIcon,
  Shield,
  ShieldHalf,
  Stars,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Briefcase,
  PiggyBank,
} from "lucide-react";

// Server Component — no useEffect, no full-collection transfers
const DashboardPage = async () => {
  const summary = await getDashboardSummary();

  const statCards = [
    {
      title: "Admins",
      value: summary.counts.admins,
      icon: Shield,
      color: "purple",
      sub: "System admins",
    },
    {
      title: "Moderators",
      value: summary.counts.moderators,
      icon: ShieldHalf,
      color: "blue",
      sub: "Content moderators",
    },
    {
      title: "Projects",
      value: summary.counts.projects,
      icon: FilesIcon,
      color: "emerald",
      sub: "Portfolio entries",
    },
    {
      title: "Testimonials",
      value: summary.counts.reviews,
      icon: Stars,
      color: "amber",
      sub: "Client reviews",
    },
    {
      title: "Resources",
      value: summary.counts.resources,
      icon: CodeIcon,
      color: "indigo",
      sub: "Published items",
    },
    {
      title: "Transactions",
      value: summary.counts.transactions,
      icon: DollarSign,
      color: "emerald",
      sub: "Revenue records",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-7xl mx-auto px-5 py-8 space-y-8">

        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-emerald-400/80 mb-1">
              ArtistyCode Studio
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard Overview
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Real-time platform metrics and insights
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Financials Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earnings (primary) */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-emerald-900/25 via-emerald-900/10 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Total Earnings
                </p>
              </div>
              <p className="text-4xl font-bold text-white tabular-nums mt-1">
                ৳{summary.financials.totalEarnings.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Revenue − Spend</span>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-indigo-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Revenue
                </p>
              </div>
              <p className="text-4xl font-bold text-white tabular-nums mt-1">
                ৳{summary.financials.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-indigo-300 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Income · excl. Spend</span>
              </div>
            </div>
          </div>

          {/* Spend */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-rose-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-rose-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Spend
                </p>
              </div>
              <p className="text-4xl font-bold text-white tabular-nums mt-1">
                ৳{summary.financials.totalSpend.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-rose-300 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>Operating costs</span>
              </div>
            </div>
          </div>

          {/* Reserve */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-violet-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-violet-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Reserve
                </p>
              </div>
              <p className="text-4xl font-bold text-white tabular-nums mt-1">
                ৳{summary.financials.totalReserve.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-violet-300 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Reserve − Spend</span>
              </div>
            </div>
          </div>
        </div>

        {/* Due Card — standalone warning-style card underneath */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-amber-900/20 via-amber-900/10 to-[#0d0d0d] p-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                    Outstanding Due
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">Amount pending collection from clients</p>
                </div>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-4xl font-bold text-white tabular-nums">
                ৳{summary.financials.totalDue.toLocaleString()}
              </p>
              <p className="text-xs text-amber-300/80 mt-1 flex items-center gap-1.5 justify-end sm:justify-start">
                <TrendingDown className="w-3 h-3" />
                All-time accumulated
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colorMap: Record<string, string> = {
              purple: "text-purple-400 bg-purple-400/10",
              blue: "text-blue-400 bg-blue-400/10",
              emerald: "text-emerald-400 bg-emerald-400/10",
              amber: "text-amber-400 bg-amber-400/10",
              indigo: "text-indigo-400 bg-indigo-400/10",
            };
            const iconStyle = colorMap[card.color] || "text-white/60 bg-white/10";
            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-white/[0.07] bg-[#0d0d0d] hover:bg-[#111] hover:border-white/10 transition-all duration-300 p-5"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${iconStyle}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {card.value}
                </p>
                <p className="text-xs font-medium text-white/50 mt-0.5">
                  {card.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts & Recent Transactions — lazy loaded on client */}
        <DashboardClient
          counts={summary.counts}
          recentTransactions={summary.recentTransactions}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

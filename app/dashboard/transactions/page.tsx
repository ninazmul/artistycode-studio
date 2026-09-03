import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAllTransactions } from "@/lib/actions/transaction.actions";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import { Plus, TrendingUp, TrendingDown, Wallet, ShoppingCart, Briefcase, PiggyBank } from "lucide-react";

const Page = async () => {
  const authData = await auth();
  const userId = authData.userId || "";
  const transactions = await getAllTransactions();

  // O(N) financial aggregation on server — no client-side recalculation
  // Revenue = INCOME (exclude Spend transactions)
  let totalRevenue = 0;
  let totalDue = 0;
  let totalSpend = 0;
  let totalReserve = 0;
  for (const t of transactions || []) {
    const amount = Number(t.amount || 0);
    const due = Number(t.due_amount || 0);
    const category = String(t.category || "");

    totalDue += due;
    if (category === "Spend") {
      totalSpend += amount;
    } else if (category === "Reserve") {
      totalReserve += amount;
      totalRevenue += amount;
    } else {
      totalRevenue += amount;
    }
  }
  const totalEarnings = Math.max(0, totalRevenue - totalSpend);

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Revenue</p>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-white/40 mt-1">Monitor all transactions, manage records, and ensure compliance.</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white text-base">Add Transaction</DialogTitle>
                <p className="text-white/40 text-sm mt-1">Fill out all transaction details carefully.</p>
              </DialogHeader>
              <div className="mt-4">
                <TransactionForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earnings (primary) */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-emerald-900/25 via-emerald-900/10 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Net Earnings
                </p>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums mt-1">
                ৳{totalEarnings.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Revenue − Spend</span>
              </div>
            </div>
          </div>

          {/* Total Revenue (Income) */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-indigo-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Revenue
                </p>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums mt-1">
                ৳{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-indigo-300 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Income only · excl. Spend</span>
              </div>
            </div>
          </div>

          {/* Spend */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-rose-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-rose-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Spend
                </p>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums mt-1">
                ৳{totalSpend.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-rose-300 text-xs">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Operating costs</span>
              </div>
            </div>
          </div>

          {/* Outstanding Due */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-amber-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-amber-300" />
                </div>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  Outstanding Due
                </p>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums mt-1">
                ৳{totalDue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-amber-300 text-xs">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Pending collections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reserve Card — standalone below */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-violet-900/20 via-violet-900/10 to-[#0d0d0d] p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.14em]">
                    Reserve Balance
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">Funds set aside · separate from operating cash</p>
                </div>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-4xl font-bold text-white tabular-nums">
                ৳{totalReserve.toLocaleString()}
              </p>
              <p className="text-xs text-violet-300/80 mt-1 flex items-center gap-1.5 justify-end sm:justify-start">
                <Briefcase className="w-3 h-3" />
                All-time accumulated
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
            All Records ({transactions?.length || 0})
          </p>
          <TransactionTable userId={userId} transactions={transactions} />
        </div>
      </div>
    </section>
  );
};

export default Page;

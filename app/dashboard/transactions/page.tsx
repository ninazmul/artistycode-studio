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
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const transactions = await getAllTransactions();

  // O(N) financial aggregation on server — no client-side recalculation
  let totalRevenue = 0;
  let totalDue = 0;
  for (const t of transactions || []) {
    totalRevenue += Number(t.amount || 0);
    totalDue += Number(t.due_amount || 0);
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-emerald-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white tabular-nums">৳{totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{transactions?.length || 0} transactions</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-amber-900/20 to-[#0d0d0d] p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Outstanding Due</p>
            <p className="text-3xl font-bold text-white tabular-nums">৳{totalDue.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-xs">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Pending collections</span>
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

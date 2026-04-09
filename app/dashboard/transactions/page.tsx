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

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const transactions = await getAllTransactions();

  return (
    <section className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 🔹 HERO HEADER + DIALOG TRIGGER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Transactions
            </h1>
            <p className="text-white/60 max-w-lg">
              Monitor all transactions, manage records, and ensure compliance.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:text-white hover:bg-black rounded-md px-6">
                Add Transaction
              </Button>
            </DialogTrigger>

            <DialogContent className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl max-w-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  Add Transaction
                </DialogTitle>
                <p className="text-white/70 mt-2">
                  Fill out the form carefully. Ensure all transaction details
                  are accurate.
                </p>
              </DialogHeader>

              <div className="mt-6">
                <TransactionForm userId={userId} type="Create" />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 🔹 TRANSACTION TABLE */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <TransactionTable userId={userId} transactions={transactions} />
        </div>
      </div>
    </section>
  );
};

export default Page;

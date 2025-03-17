import { auth } from "@clerk/nextjs/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAllTransactions } from "@/lib/actions/transaction.actions";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import TransactionsOverview from "../components/TransactionsOverview";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const transactions = await getAllTransactions();

  // Calculate totals safely
  const totalIncomeRaw = transactions.reduce(
    (sum: number, t: { amount?: number }) => sum + (Number(t.amount) || 0),
    0
  );

  // Calculate total spend and reserve amounts separately
  const totalSpend = transactions
    .filter((t: { category?: string }) => t.category === "Spend")
    .reduce(
      (sum: number, t: { amount?: number }) => sum + (Number(t.amount) || 0),
      0
    );

  const totalReserve = transactions
    .filter((t: { category?: string }) => t.category === "Reserve")
    .reduce(
      (sum: number, t: { amount?: number }) => sum + (Number(t.amount) || 0),
      0
    );

  // Calculate net income by removing spend and reserve from total income
  const totalIncome = totalIncomeRaw - totalSpend - totalReserve;

  const totalDue = transactions.reduce(
    (sum: number, t: { due_amount?: number }) =>
      sum + (Number(t.due_amount) || 0),
    0
  );

  return (
    <>
      <section className="backdrop-blur-md shadow-md py-5 md:py-10">
        <TransactionsOverview
          totalIncome={totalIncome}
          totalDue={totalDue}
          totalSpend={totalSpend}
          totalReserve={totalReserve}
        />
      </section>
      <section className="backdrop-blur-md shadow-md py-5 md:py-10">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="text-3xl text-center sm:text-left">
              All Transactions
            </h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full bg-purple">
                Add Transaction
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="backdrop-blur-md shadow-md">
            <SheetHeader>
              <SheetTitle>Add Transaction</SheetTitle>
              <SheetDescription>
                Use this form to add a new transaction. Ensure the details are
                accurate and comply with the system guidelines for proper
                record-keeping.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <TransactionForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <TransactionTable userId={userId} transactions={transactions} />
      </div>
    </>
  );
};

export default Page;

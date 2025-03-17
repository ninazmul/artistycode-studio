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
import { Card } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { DollarSign, ShoppingCart, Briefcase, AlertCircle } from "lucide-react";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const transactions = await getAllTransactions();

  // Calculate totals
  const totalIncome = transactions.reduce(
    (sum: number, t: { amount: number }) => sum + Number(t.amount),
    0
  );
  const totalDue = transactions.reduce(
    (sum: number, t: { due_amount: number }) => sum + Number(t.due_amount),
    0
  );
  const totalSpend = transactions
    .filter((t: { category: string }) => t.category === "Spend")
    .reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0);
  const totalReserve = transactions
    .filter((t: { category: string }) => t.category === "Reserve")
    .reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0);

  const labels = ["Income", "Spend", "Reserve", "Due Amount"];
  const datasetValues = [totalIncome, totalSpend, totalReserve, totalDue];

  const pieData = {
    labels,
    datasets: [
      {
        data: datasetValues,
        backgroundColor: [
          "#1E90FF",
          "#28A745",
          "#6F42C1",
          "#FFC107",
          "#FD7E14",
          "#6610F2",
          "#20C997",
        ],
        hoverBackgroundColor: [
          "#007BFF",
          "#218838",
          "#5A32A1",
          "#E0A800",
          "#E45900",
          "#520DC2",
          "#138B6A",
        ],
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Data Overview",
        data: datasetValues,
        backgroundColor: [
          "#1E90FF",
          "#28A745",
          "#6F42C1",
          "#FFC107",
          "#FD7E14",
          "#6610F2",
          "#20C997",
        ],
        borderColor: [
          "#007BFF",
          "#218838",
          "#5A32A1",
          "#E0A800",
          "#E45900",
          "#520DC2",
          "#138B6A",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <section className="backdrop-blur-md shadow-md py-5 md:py-10">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl text-center sm:text-left">
            Transactions Overview
          </h3>
          <Button size="lg" className="rounded-full bg-purple">
            Filter By Date
          </Button>
        </div>
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              icon={<DollarSign className="text-3xl text-blue-500" />}
              title="Total Income"
              value={`$${totalIncome}`}
            />
            <DashboardCard
              icon={<AlertCircle className="text-3xl text-red-500" />}
              title="Due Amount"
              value={`$${totalDue}`}
            />
            <DashboardCard
              icon={<ShoppingCart className="text-3xl text-green-500" />}
              title="Total Spend"
              value={`$${totalSpend}`}
            />
            <DashboardCard
              icon={<Briefcase className="text-3xl text-purple" />}
              title="Reserve"
              value={`$${totalReserve}`}
            />
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
                <Bar data={barData} />
              </div>
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">Pie Chart</h3>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
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

// Reusable Card Component
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const DashboardCard = ({ icon, title, value }: DashboardCardProps) => (
  <Card className="flex items-center bg-white-100/10 p-6 rounded-md backdrop-blur-md shadow-md w-full">
    <div className="text-7xl w-1/5 text-center">{icon}</div>
    <div className="flex-1 ml-4 space-y-2">
      <p className="text-lg font-semibold text-white-100">{title}</p>
      <p className="text-3xl font-bold text-white-200">{value}</p>
    </div>
  </Card>
);

export default Page;

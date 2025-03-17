"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import { DollarSign, ShoppingCart, Briefcase, AlertCircle } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

const TransactionsOverview = ({
  totalIncome = 0,
  totalDue = 0,
  totalReserve = 0,
  totalSpend = 0,
}) => {
  const labels = ["Income", "Spend", "Reserve", "Due Amount"];
  const datasetValues = [totalIncome, totalSpend, totalReserve, totalDue];

  const pieData = {
    labels,
    datasets: [
      {
        data: datasetValues,
        backgroundColor: ["#1E90FF", "#28A745", "#6F42C1", "#FFC107"],
        hoverBackgroundColor: ["#007BFF", "#218838", "#5A32A1", "#E0A800"],
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Data Overview",
        data: datasetValues,
        backgroundColor: ["#1E90FF", "#28A745", "#6F42C1", "#FFC107"],
        borderColor: ["#007BFF", "#218838", "#5A32A1", "#E0A800"],
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
            <TransactionCard
              icon={<DollarSign className="text-3xl text-blue-500" />}
              title="Total Income"
              value={`$${totalIncome}`}
            />
            <TransactionCard
              icon={<AlertCircle className="text-3xl text-red-500" />}
              title="Due Amount"
              value={`$${totalDue}`}
            />
            <TransactionCard
              icon={<ShoppingCart className="text-3xl text-green-500" />}
              title="Total Spend"
              value={`$${totalSpend}`}
            />
            <TransactionCard
              icon={<Briefcase className="text-3xl text-purple" />}
              title="Reserve"
              value={`$${totalReserve}`}
            />
          </div>
          <div className="mt-8">
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
    </>
  );
};

// Reusable Card Component
interface TransactionCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const TransactionCard = ({ icon, title, value }: TransactionCardProps) => (
  <Card className="flex items-center bg-white/10 p-6 rounded-md backdrop-blur-md shadow-md w-full">
    <div className="text-7xl w-1/5 text-center">{icon}</div>
    <div className="flex-1 ml-4 space-y-2">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </Card>
);

export default TransactionsOverview;

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  PointElement,
  LineElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface Transaction {
  date: string;
  amount: number;
  category: string;
  due_amount?: number;
}

const TransactionsOverview = ({
  transactions = [],
}: {
  transactions: Transaction[];
}) => {
  // Get today's date and one year ago
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  // Filter transactions based on selected date range
  useEffect(() => {
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactions]);

  // Calculate financial statistics from filtered transactions
  const totalIncome = filteredTransactions.reduce(
    (sum, t) => (t.category !== "Spend" ? sum + Number(t.amount) : sum),
    0
  );

  const totalSpend = filteredTransactions.reduce(
    (sum, t) => (t.category === "Spend" ? sum + Number(t.amount) : sum),
    0
  );

  const totalReserve = filteredTransactions.reduce(
    (sum, t) => (t.category === "Reserve" ? sum + Number(t.amount) : sum),
    0
  );

  const totalDue = filteredTransactions.reduce(
    (sum, t) => sum + Number(t.due_amount || 0),
    0
  );

  // Prepare data for charts
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
        label: "Financial Summary",
        data: datasetValues,
        backgroundColor: ["#1E90FF", "#28A745", "#6F42C1", "#FFC107"],
        borderColor: ["#007BFF", "#218838", "#5A32A1", "#E0A800"],
        borderWidth: 1,
      },
    ],
  };

  // Group transactions by month
  const monthlyData: {
    [key: string]: {
      income: number;
      spend: number;
      reserve: number;
      due: number;
    };
  } = {};
  filteredTransactions.forEach((t) => {
    const monthYear = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { income: 0, spend: 0, reserve: 0, due: 0 };
    }

    if (t.category !== "Spend")
      monthlyData[monthYear].income += Number(t.amount);
    if (t.category === "Spend")
      monthlyData[monthYear].spend += Number(t.amount);
    if (t.category === "Reserve")
      monthlyData[monthYear].reserve += Number(t.amount);
    monthlyData[monthYear].due += Number(t.due_amount || 0);
  });

  const months = Object.keys(monthlyData);
  const incomeData = months.map((m) => monthlyData[m].income);
  const spendData = months.map((m) => monthlyData[m].spend);
  const reserveData = months.map((m) => monthlyData[m].reserve);
  const dueData = months.map((m) => monthlyData[m].due);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#1E90FF",
        backgroundColor: "#1E90FF50",
        fill: true,
      },
      {
        label: "Spend",
        data: spendData,
        borderColor: "#28A745",
        backgroundColor: "#28A74550",
        fill: true,
      },
      {
        label: "Reserve",
        data: reserveData,
        borderColor: "#6F42C1",
        backgroundColor: "#6F42C150",
        fill: true,
      },
      {
        label: "Due Amount",
        data: dueData,
        borderColor: "#FFC107",
        backgroundColor: "#FFC10750",
        fill: true,
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
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
            />
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TransactionCard
              icon={<DollarSign className="text-3xl text-blue-500" />}
              title="Total Income"
              value={`$${totalIncome}`}
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
            <TransactionCard
              icon={<AlertCircle className="text-3xl text-red-500" />}
              title="Due Amount"
              value={`$${totalDue}`}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full">
              <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
              <Bar data={barData} />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-medium mb-4">Pie Chart</h3>
              <Pie data={pieData} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Monthly Revenue Trend</h3>
            <Line data={lineData} />
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
  value: string;
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

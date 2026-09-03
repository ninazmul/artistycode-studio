"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  DollarSign,
  ShoppingCart,
  Briefcase,
  AlertCircle,
  Calendar,
  PiggyBank,
  Wallet,
} from "lucide-react";
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
  LineElement,
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
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactions]);

  // Calculate totals (within selected date range)
  // Revenue = Income (everything except Spend). Matches aggregation in dashboard.actions
  const totalIncome = filteredTransactions.reduce(
    (sum, t) => (t.category !== "Spend" ? sum + Number(t.amount) : sum),
    0,
  );
  const totalSpend = filteredTransactions.reduce(
    (sum, t) => (t.category === "Spend" ? sum + Number(t.amount) : sum),
    0,
  );
  const totalReserve = filteredTransactions.reduce(
    (sum, t) => (t.category === "Reserve" ? sum + Number(t.amount) : sum),
    0,
  );
  const totalEarnings = Math.max(0, totalIncome - totalSpend);
  const totalDue = filteredTransactions.reduce(
    (sum, t) => sum + Number(t.due_amount || 0),
    0,
  );

  // ✅ NEW: due across all time (ignores date filter)
  const totalDueAllTime = transactions.reduce(
    (sum, t) => sum + Number(t.due_amount || 0),
    0,
  );

  // Chart data — label/currency semantics aligned with dashboard card colors
  const labels = ["Revenue", "Spend", "Reserve", "Due", "Net Earnings"];
  const datasetValues = [
    totalIncome,
    totalSpend,
    totalReserve,
    totalDue,
    totalEarnings,
  ];
  // colors: indigo (Revenue), rose (Spend), violet (Reserve), amber (Due), emerald (Earnings)
  const colors = [
    "rgba(99,102,241,0.8)",
    "rgba(244,63,94,0.8)",
    "rgba(168,85,247,0.8)",
    "rgba(251,191,36,0.8)",
    "rgba(16,185,129,0.8)",
  ];

  const barData = {
    labels,
    datasets: [
      {
        label: "Transactions",
        data: datasetValues,
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };
  const pieData = {
    labels,
    datasets: [{ data: datasetValues, backgroundColor: colors }],
  };

  // Monthly trend
  const monthlyData: Record<
    string,
    { revenue: number; spend: number; reserve: number; due: number; earnings: number }
  > = {};
  filteredTransactions.forEach((t) => {
    const monthYear = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthlyData[monthYear])
      monthlyData[monthYear] = { revenue: 0, spend: 0, reserve: 0, due: 0, earnings: 0 };
    if (t.category !== "Spend")
      monthlyData[monthYear].revenue += Number(t.amount);
    if (t.category === "Spend")
      monthlyData[monthYear].spend += Number(t.amount);
    if (t.category === "Reserve")
      monthlyData[monthYear].reserve += Number(t.amount);
    monthlyData[monthYear].due += Number(t.due_amount || 0);
    // Derive net earnings per month
    monthlyData[monthYear].earnings = Math.max(
      0,
      monthlyData[monthYear].revenue - monthlyData[monthYear].spend,
    );
  });

  const months = Object.keys(monthlyData);
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: months.map((m) => monthlyData[m].revenue),
        borderColor: colors[0],
        backgroundColor: colors[0] + "50",
        fill: true,
      },
      {
        label: "Spend",
        data: months.map((m) => monthlyData[m].spend),
        borderColor: colors[1],
        backgroundColor: colors[1] + "50",
        fill: true,
      },
      {
        label: "Reserve",
        data: months.map((m) => monthlyData[m].reserve),
        borderColor: colors[2],
        backgroundColor: colors[2] + "50",
        fill: true,
      },
      {
        label: "Due",
        data: months.map((m) => monthlyData[m].due),
        borderColor: colors[3],
        backgroundColor: colors[3] + "50",
        fill: true,
      },
      {
        label: "Net Earnings",
        data: months.map((m) => monthlyData[m].earnings),
        borderColor: colors[4],
        backgroundColor: colors[4] + "50",
        fill: true,
        borderWidth: 3,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header + Date Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Transactions Overview
        </h2>
        <div className="flex gap-3 flex-wrap">
          <DateFilter
            label="From:"
            selectedDate={startDate}
            setDate={setStartDate}
          />
          <DateFilter label="To:" selectedDate={endDate} setDate={setEndDate} />
        </div>
      </div>

      {/* Transaction Cards — 6 columns now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <DashboardCard
          icon={<PiggyBank />}
          title="Net Earnings"
          value={totalEarnings}
          color="from-emerald-500 to-emerald-400"
        />
        <DashboardCard
          icon={<Wallet />}
          title="Revenue"
          value={totalIncome}
          color="from-indigo-500 to-indigo-400"
        />
        <DashboardCard
          icon={<ShoppingCart />}
          title="Spend"
          value={totalSpend}
          color="from-rose-500 to-rose-400"
        />
        <DashboardCard
          icon={<Briefcase />}
          title="Reserve"
          value={totalReserve}
          color="from-violet-500 to-violet-400"
        />
        <DashboardCard
          icon={<AlertCircle />}
          title="Due (Filtered)"
          value={totalDue}
          color="from-amber-500 to-amber-400"
        />
        <DashboardCard
          icon={<AlertCircle />}
          title="Due (All Time)"
          value={totalDueAllTime}
          color="from-orange-500 to-orange-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
          <Bar data={barData} />
        </Card>
        <Card className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
          <Pie data={pieData} />
        </Card>
        <Card className="lg:col-span-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <Line data={lineData} />
        </Card>
      </div>
    </div>
  );
};

// Dashboard-style Transaction Card
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color?: string;
}
const DashboardCard = ({ icon, title, value, color }: DashboardCardProps) => (
  <Card
    className={`relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b ${color || "from-white/10 to-white/5"} backdrop-blur-xl hover:scale-[1.03] transition-all duration-300`}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition" />
    <div className="relative flex flex-col gap-4">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm text-white/60">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

// Reusable date filter
interface DateFilterProps {
  label: string;
  selectedDate: Date;
  setDate: (date: Date) => void;
}
const DateFilter = ({ label, selectedDate, setDate }: DateFilterProps) => (
  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
    <Calendar className="text-white" />
    <span className="text-white/80">{label}</span>
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setDate(date as Date)}
      className="bg-transparent text-white border-none focus:ring-0"
    />
  </div>
);

export default TransactionsOverview;

"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CodeIcon, FilesIcon, Shield, ShieldHalf, Stars } from "lucide-react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cache } from "react";
import { getAllProjects } from "@/lib/actions/project.actions";
import { getAllAdmins } from "@/lib/actions/admin.actions";
import { getAllModerators } from "@/lib/actions/moderator.actions";
import { getAllReviews } from "@/lib/actions/review.actions";
import { getAllResources } from "@/lib/actions/resource.actions";
import { getAllTransactions } from "@/lib/actions/transaction.actions";
import {
  DollarSign,
  ShoppingCart,
  Briefcase,
  AlertCircle,
  Calendar,
} from "lucide-react";

// Register chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

// Cache server actions
const getCachedAdmins = cache(() => getAllAdmins());
const getCachedModerators = cache(() => getAllModerators());
const getCachedProjects = cache(() => getAllProjects());
const getCachedReviews = cache(() => getAllReviews());
const getCachedResources = cache(() => getAllResources());
const getCachedTransactions = cache(() => getAllTransactions());

interface Transaction {
  date: string;
  amount: number;
  category: string;
  due_amount?: number;
}

const Dashboard = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [moderators, setModerators] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Date range state
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date>(today);

  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        adminData,
        moderatorData,
        projectData,
        reviewData,
        resourceData,
        transactionData,
      ] = await Promise.all([
        getCachedAdmins(),
        getCachedModerators(),
        getCachedProjects(),
        getCachedReviews(),
        getCachedResources(),
        getCachedTransactions(),
      ]);

      setAdmins(adminData);
      setModerators(moderatorData);
      setProjects(projectData);
      setReviews(reviewData);
      setResources(resourceData);
      setTransactions(transactionData);
    };

    fetchData();
  }, []);

  // Filter transactions by date
  useEffect(() => {
    const filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactions]);

  // Transactions Overview Computation
  const totalIncome = filteredTransactions.reduce(
    (sum, t) => (t.category !== "Spend" ? sum + t.amount : sum),
    0,
  );
  const totalSpend = filteredTransactions.reduce(
    (sum, t) => (t.category === "Spend" ? sum + t.amount : sum),
    0,
  );
  const totalReserve = filteredTransactions.reduce(
    (sum, t) => (t.category === "Reserve" ? sum + t.amount : sum),
    0,
  );
  const totalDue = filteredTransactions.reduce(
    (sum, t) => sum + (t.due_amount || 0),
    0,
  );

  const transactionLabels = ["Income", "Spend", "Reserve", "Due"];
  const transactionValues = [totalIncome, totalSpend, totalReserve, totalDue];
  const transactionColors = [
    "rgba(99,102,241,0.8)", // Indigo
    "rgba(34,197,94,0.8)", // Green
    "rgba(168,85,247,0.8)", // Purple
    "rgba(251,191,36,0.8)", // Yellow
  ];

  const transactionBarData = {
    labels: transactionLabels,
    datasets: [
      {
        label: "Transactions",
        data: transactionValues,
        backgroundColor: transactionColors,
        borderRadius: 6,
      },
    ],
  };
  const transactionPieData = {
    labels: transactionLabels,
    datasets: [{ data: transactionValues, backgroundColor: transactionColors }],
  };

  // Monthly trend
  const monthlyData: Record<
    string,
    { income: number; spend: number; reserve: number; due: number }
  > = {};
  filteredTransactions.forEach((t) => {
    const monthYear = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthlyData[monthYear])
      monthlyData[monthYear] = { income: 0, spend: 0, reserve: 0, due: 0 };
    if (t.category !== "Spend") monthlyData[monthYear].income += t.amount;
    if (t.category === "Spend") monthlyData[monthYear].spend += t.amount;
    if (t.category === "Reserve") monthlyData[monthYear].reserve += t.amount;
    monthlyData[monthYear].due += t.due_amount || 0;
  });

  const months = Object.keys(monthlyData);
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => monthlyData[m].income),
        borderColor: transactionColors[0],
        backgroundColor: transactionColors[0] + "50",
        fill: true,
      },
      {
        label: "Spend",
        data: months.map((m) => monthlyData[m].spend),
        borderColor: transactionColors[1],
        backgroundColor: transactionColors[1] + "50",
        fill: true,
      },
      {
        label: "Reserve",
        data: months.map((m) => monthlyData[m].reserve),
        borderColor: transactionColors[2],
        backgroundColor: transactionColors[2] + "50",
        fill: true,
      },
      {
        label: "Due",
        data: months.map((m) => monthlyData[m].due),
        borderColor: transactionColors[3],
        backgroundColor: transactionColors[3] + "50",
        fill: true,
      },
    ],
  };

  // Other dashboard data
  const labels = ["Admins", "Moderators", "Projects", "Reviews", "Resources"];
  const datasetValues = [
    admins.length,
    moderators.length,
    projects.length,
    reviews.length,
    resources.length,
  ];
  const chartColors = [
    "rgba(99,102,241,0.8)",
    "rgba(34,197,94,0.8)",
    "rgba(168,85,247,0.8)",
    "rgba(251,191,36,0.8)",
    "rgba(249,115,22,0.8)",
  ];
  const pieData = {
    labels,
    datasets: [{ data: datasetValues, backgroundColor: chartColors }],
  };
  const barData = {
    labels,
    datasets: [
      {
        label: "Overview",
        data: datasetValues,
        backgroundColor: chartColors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-white/50">
            Monitor your platform performance and activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <DashboardCard
            icon={<Shield />}
            title="Admins"
            value={admins.length}
          />
          <DashboardCard
            icon={<ShieldHalf />}
            title="Moderators"
            value={moderators.length}
          />
          <DashboardCard
            icon={<FilesIcon />}
            title="Projects"
            value={projects.length}
          />
          <DashboardCard
            icon={<Stars />}
            title="Testimonials"
            value={reviews.length}
          />
          <DashboardCard
            icon={<CodeIcon />}
            title="Resources"
            value={resources.length}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-6">Growth Overview</h2>
            <Bar data={barData} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-6">Distribution</h2>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Transactions Overview
          </h2>

          {/* Date Filter */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Calendar />
              <span>From:</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date as Date)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Calendar />
              <span>To:</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date as Date)}
              />
            </div>
          </div>

          {/* Transaction Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <DashboardCard
              icon={<DollarSign />}
              title="Income"
              value={totalIncome}
              color="from-indigo-500 to-indigo-400"
            />
            <DashboardCard
              icon={<ShoppingCart />}
              title="Spend"
              value={totalSpend}
              color="from-green-500 to-green-400"
            />
            <DashboardCard
              icon={<Briefcase />}
              title="Reserve"
              value={totalReserve}
              color="from-purple-500 to-purple-400"
            />
            <DashboardCard
              icon={<AlertCircle />}
              title="Due"
              value={totalDue}
              color="from-yellow-500 to-yellow-400"
            />
          </div>

          {/* Transaction Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
              <Bar data={transactionBarData} />
            </Card>
            <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
              <Pie data={transactionPieData} />
            </Card>
            <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
              <Line data={lineData} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default Dashboard;

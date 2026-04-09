"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CodeIcon, FilesIcon, Shield, ShieldHalf, Stars } from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { cache } from "react";
import { getAllProjects } from "@/lib/actions/project.actions";
import { getAllAdmins } from "@/lib/actions/admin.actions";
import { getAllModerators } from "@/lib/actions/moderator.actions";
import { getAllReviews } from "@/lib/actions/review.actions";
import { getAllResources } from "@/lib/actions/resource.actions";
import TransactionsOverview from "./components/TransactionsOverview";
import { getAllTransactions } from "@/lib/actions/transaction.actions";

// Register chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

// ✅ Wrap your server actions with cache() for memoization
const getCachedAdmins = cache(async () => await getAllAdmins());
const getCachedModerators = cache(async () => await getAllModerators());
const getCachedProjects = cache(async () => await getAllProjects());
const getCachedReviews = cache(async () => await getAllReviews());
const getCachedResources = cache(async () => await getAllResources());
const getCachedTransactions = cache(async () => await getAllTransactions());

const Dashboard = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [moderators, setModerators] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [adminData, moderatorData, projectData, reviewData, resourceData, transactionData] =
        await Promise.all([
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

  const labels = ["Admins", "Moderators", "Projects", "Reviews", "Resources"];
  const datasetValues = [
    admins.length,
    moderators.length,
    projects.length,
    reviews.length,
    resources.length,
  ];

  const chartColors = [
    "rgba(99,102,241,0.8)", // Indigo
    "rgba(34,197,94,0.8)", // Green
    "rgba(168,85,247,0.8)", // Purple
    "rgba(251,191,36,0.8)", // Yellow
    "rgba(249,115,22,0.8)", // Orange
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
          {/* Bar Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-6">Growth Overview</h2>
            <Bar data={barData} />
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-6">Distribution</h2>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
      <TransactionsOverview transactions={transactions} />
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const DashboardCard = ({ icon, title, value }: DashboardCardProps) => (
  <Card className="relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl hover:scale-[1.03] transition-all duration-300">
    {/* Glow Effect */}
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

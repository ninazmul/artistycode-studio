"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { FilesIcon, Shield, ShieldHalf, Stars } from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
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
import { getAllProjects } from "@/lib/actions/project.actions";
import { getAllAdmins } from "@/lib/actions/admin.actions";
import { getAllModerators } from "@/lib/actions/moderator.actions";
import { getAllReviews } from "@/lib/actions/review.actions";

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

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminData, moderatorData, projectData, reviewData] = await Promise.all([
          getAllAdmins(),
          getAllModerators(),
          getAllProjects(),
          getAllReviews(),
        ]);

        setAdmins(adminData);
        setModerators(moderatorData);
        setProjects(projectData);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const labels = ["Admins", "Moderators", "Projects", "Reviews"];

  const datasetValues = [admins.length, moderators.length, projects.length, reviews.length];

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard
          icon={<Shield className="text-3xl text-blue-500" />}
          title="Admins"
          value={`${admins.length}`}
        />
        <DashboardCard
          icon={<ShieldHalf className="text-3xl text-green-500" />}
          title="Moderators"
          value={`${moderators.length}`}
        />
        <DashboardCard
          icon={<FilesIcon className="text-3xl text-purple" />}
          title="Projects"
          value={`${projects.length}`}
        />
        <DashboardCard
          icon={<Stars className="text-3xl text-yellow-500" />}
          title="Testimonials"
          value={`${reviews.length}`}
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
  );
};

// Reusable Card Component
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const DashboardCard = ({ icon, title, value }: DashboardCardProps) => (
  <Card className="flex items-center border border-gray-300 shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-7xl w-1/5 text-center">{icon}</div>
    <div className="flex-1 ml-4 space-y-2">
      <p className="text-lg font-semibold text-gray-600">{title}</p>
      <p className=" text-3xl font-bold">{value}</p>
    </div>
  </Card>
);

export default Dashboard;

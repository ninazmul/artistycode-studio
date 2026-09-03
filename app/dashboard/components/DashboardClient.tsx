"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Lazy load heavy chart.js components — not in initial bundle
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), {
  ssr: false,
  loading: () => (
    <div className="h-56 rounded-xl bg-white/[0.03] animate-pulse" />
  ),
});

const Pie = dynamic(() => import("react-chartjs-2").then((m) => m.Pie), {
  ssr: false,
  loading: () => (
    <div className="h-56 rounded-xl bg-white/[0.03] animate-pulse" />
  ),
});

// Register chart.js modules lazily — executed only on client after mount
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface DashboardClientProps {
  counts: {
    admins: number;
    moderators: number;
    projects: number;
    reviews: number;
    resources: number;
    transactions: number;
  };
  recentTransactions: any[];
}

const CHART_COLORS = [
  "rgba(168,85,247,0.75)",
  "rgba(59,130,246,0.75)",
  "rgba(52,211,153,0.75)",
  "rgba(251,191,36,0.75)",
  "rgba(99,102,241,0.75)",
];

const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "rgba(255,255,255,0.5)",
        font: { size: 11 },
        boxWidth: 12,
        padding: 16,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "rgba(255,255,255,0.4)", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.04)" },
    },
    y: {
      ticks: { color: "rgba(255,255,255,0.4)", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.04)" },
    },
  },
};

const PIE_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "rgba(255,255,255,0.5)",
        font: { size: 11 },
        boxWidth: 12,
        padding: 14,
      },
    },
  },
};

export default function DashboardClient({ counts, recentTransactions }: DashboardClientProps) {
  const labels = ["Admins", "Moderators", "Projects", "Reviews", "Resources"];
  const values = [
    counts.admins,
    counts.moderators,
    counts.projects,
    counts.reviews,
    counts.resources,
  ];

  const barData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Count",
          data: values,
          backgroundColor: CHART_COLORS,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [counts]
  );

  const pieData = useMemo(
    () => ({
      labels,
      datasets: [{ data: values, backgroundColor: CHART_COLORS, borderWidth: 0 }],
    }),
    [counts]
  );

  // Build month-based revenue map from recent transactions — O(N) single pass
  const monthlyMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of recentTransactions) {
      const key = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    }
    return map;
  }, [recentTransactions]);

  const monthLabels = Object.keys(monthlyMap);
  const monthValues = Object.values(monthlyMap);

  const revenueBarData = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: "Revenue ৳",
          data: monthValues,
          backgroundColor: "rgba(52,211,153,0.65)",
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [monthLabels, monthValues]
  );

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart — Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Platform Distribution
          </p>
          <Bar data={barData} options={CHART_OPTIONS} />
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Breakdown
          </p>
          <Pie data={pieData} options={PIE_OPTIONS} />
        </div>
      </div>

      {/* Revenue Timeline */}
      {monthLabels.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Recent Revenue Timeline
          </p>
          <Bar data={revenueBarData} options={CHART_OPTIONS} />
        </div>
      )}

      {/* Recent Transactions Table */}
      {recentTransactions.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
            Recent Transactions
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Date", "Project", "Category", "Revenue", "Due"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-3 text-[11px] font-semibold uppercase tracking-widest text-white/25"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.slice(0, 10).map((t, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 text-white/40 text-xs whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-white/70 max-w-[180px] truncate">
                      {t.project}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-400 font-semibold tabular-nums">
                      ৳{Number(t.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-amber-400 tabular-nums">
                      {Number(t.due_amount || 0) > 0
                        ? `৳${Number(t.due_amount).toLocaleString()}`
                        : <span className="text-white/20">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Admin from "../database/models/admin.model";
import Moderator from "../database/models/moderator.model";
import Project from "../database/models/project.model";
import Review from "../database/models/review.model";
import Resource from "../database/models/resource.model";
import Transaction from "../database/models/transaction.model";

export interface DashboardSummary {
  counts: {
    admins: number;
    moderators: number;
    projects: number;
    reviews: number;
    resources: number;
    transactions: number;
  };
  recentTransactions: any[];
  financials: {
    totalRevenue: number;
    totalDue: number;
    totalSpend: number;
    totalReserve: number;
    totalEarnings: number;
  };
}

/**
 * Optimized dashboard aggregator:
 * Executes fast parallel countDocuments queries and MongoDB aggregation pipelines
 * instead of transferring all collections across the network.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    await connectToDatabase();

    const [
      adminsCount,
      moderatorsCount,
      projectsCount,
      reviewsCount,
      resourcesCount,
      transactionsCount,
      recentTransactions,
      financialAgg,
    ] = await Promise.all([
      Admin.countDocuments().catch(() => 0),
      Moderator.countDocuments().catch(() => 0),
      Project.countDocuments().catch(() => 0),
      Review.countDocuments().catch(() => 0),
      Resource.countDocuments().catch(() => 0),
      Transaction.countDocuments().catch(() => 0),
      Transaction.find()
        .sort({ date: -1 })
        .limit(20)
        .lean()
        .catch(() => []),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalAmountAll: {
              $sum: {
                $convert: {
                  input: "$amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
            totalDue: {
              $sum: {
                $convert: {
                  input: "$due_amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
            totalSpend: {
              $sum: {
                $cond: [
                  { $eq: ["$category", "Spend"] },
                  {
                    $convert: {
                      input: "$amount",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                  0,
                ],
              },
            },
            totalReserve: {
              $sum: {
                $cond: [
                  { $eq: ["$category", "Reserve"] },
                  {
                    $convert: {
                      input: "$amount",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                  0,
                ],
              },
            },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $ne: ["$category", "Spend"] },
                  {
                    $convert: {
                      input: "$amount",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      ]).catch(() => []),
    ]);

    // ── Financial aggregation ──────────────────────────────────────
    // WARNING: formulas below MUST stay in sync with the pure helper
    // calculateFinancialSummary() in @/lib/utils.ts (used by pages/components)
    //
    // Semantics:
    //   totalRevenue  = Σ amount where category != "Spend"
    //   totalDue      = Σ due_amount (all)
    //   totalSpend    = Σ amount where category == "Spend"
    //   grossReserve  = Σ amount where category == "Reserve"  (Mongo field: totalReserve)
    //   totalReserve  = max(0, grossReserve − totalSpend)     ← JS post-process
    //   totalEarnings = max(0, totalRevenue − totalSpend)    ← JS post-process
    //
    // If you change a formula here, update lib/utils.ts too.
    // ───────────────────────────────────────────────────────────────
    const f = financialAgg?.[0] || {};
    const totalRevenue = f.totalRevenue || 0;
    const totalDue = f.totalDue || 0;
    const totalSpend = f.totalSpend || 0;
    const grossReserve = f.totalReserve || 0;
    const totalReserve = Math.max(0, grossReserve - totalSpend);
    const totalEarnings = Math.max(0, totalRevenue - totalSpend);

    return {
      counts: {
        admins: adminsCount || 0,
        moderators: moderatorsCount || 0,
        projects: projectsCount || 0,
        reviews: reviewsCount || 0,
        resources: resourcesCount || 0,
        transactions: transactionsCount || 0,
      },
      recentTransactions: JSON.parse(JSON.stringify(recentTransactions || [])),
      financials: {
        totalRevenue,
        totalDue,
        totalSpend,
        totalReserve,
        totalEarnings,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    return {
      counts: {
        admins: 0,
        moderators: 0,
        projects: 0,
        reviews: 0,
        resources: 0,
        transactions: 0,
      },
      recentTransactions: [],
      financials: {
        totalRevenue: 0,
        totalDue: 0,
        totalSpend: 0,
        totalReserve: 0,
        totalEarnings: 0,
      },
    };
  }
}

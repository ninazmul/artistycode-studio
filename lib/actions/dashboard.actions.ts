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
      Admin.countDocuments(),
      Moderator.countDocuments(),
      Project.countDocuments(),
      Review.countDocuments(),
      Resource.countDocuments(),
      Transaction.countDocuments(),
      Transaction.find().sort({ date: -1 }).limit(20).lean(),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $toDouble: "$amount" } },
            totalDue: { $sum: { $toDouble: { $ifNull: ["$due_amount", 0] } } },
          },
        },
      ]),
    ]);

    const totalRevenue = financialAgg[0]?.totalRevenue || 0;
    const totalDue = financialAgg[0]?.totalDue || 0;

    return {
      counts: {
        admins: adminsCount,
        moderators: moderatorsCount,
        projects: projectsCount,
        reviews: reviewsCount,
        resources: resourcesCount,
        transactions: transactionsCount,
      },
      recentTransactions: JSON.parse(JSON.stringify(recentTransactions)),
      financials: {
        totalRevenue,
        totalDue,
      },
    };
  } catch (error) {
    handleError(error);
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
      },
    };
  }
}

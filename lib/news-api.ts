import { connectToDatabase } from "@/lib/database";
import NewsApiUsage from "@/lib/database/models/newsApiUsage.model";

const BASE_URL = "https://api.thenewsapi.com/v1/news";

export interface NewsApiArticle {
  uuid: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
  categories: string[];
  locale: string;
}

export interface NewsApiResponse {
  meta?: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data?: NewsApiArticle[];
  error?: {
    code: string;
    message: string;
  };
}

export interface FetchNewsResult {
  success: boolean;
  blocked?: boolean;
  reason?: string;
  articles?: NewsApiArticle[];
  error?: string;
  requestsToday?: number;
  dailyLimit?: number;
}

/**
 * Get current UTC date string YYYY-MM-DD
 */
function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get current daily limit from process.env with a conservative default (10)
 */
export function getDailyLimit(): number {
  const envLimit = process.env.NEWS_API_DAILY_LIMIT;
  if (envLimit && !isNaN(Number(envLimit))) {
    return Math.max(1, Number(envLimit));
  }
  return 10;
}

/**
 * Centralized Request Guard:
 * Checks daily limit in MongoDB before making any call to The News API.
 */
export async function fetchFromNewsApiGuarded({
  searchQuery,
  categories,
  language = "en",
  limit = 5,
}: {
  searchQuery: string;
  categories?: string;
  language?: string;
  limit?: number;
}): Promise<FetchNewsResult> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("[NewsAPI Guard] NEWS_API_KEY is not configured.");
    return {
      success: false,
      error: "NEWS_API_KEY environment variable is missing",
    };
  }

  const dailyLimit = getDailyLimit();
  const todayStr = getTodayDateString();

  try {
    await connectToDatabase();

    // Read or initialize today's usage atomically
    let usageDoc = await NewsApiUsage.findOne({ date: todayStr });

    if (!usageDoc) {
      usageDoc = await NewsApiUsage.create({ date: todayStr, requests: 0 });
    }

    if (usageDoc.requests >= dailyLimit) {
      console.warn(
        `[NewsAPI Guard] Request blocked. Today's usage (${usageDoc.requests}) has reached daily safety limit (${dailyLimit}).`
      );
      return {
        success: false,
        blocked: true,
        reason: `Daily safety limit of ${dailyLimit} requests reached for ${todayStr}`,
        requestsToday: usageDoc.requests,
        dailyLimit,
      };
    }

    // Increment request count BEFORE making the external request
    usageDoc.requests += 1;
    await usageDoc.save();

    const params = new URLSearchParams({
      api_token: apiKey,
      search: searchQuery,
      language: language,
      limit: String(Math.min(limit, 10)),
    });

    if (categories) {
      params.append("categories", categories);
    }

    const requestUrl = `${BASE_URL}/all?${params.toString()}`;
    console.log(`[NewsAPI Guard] Executing request ${usageDoc.requests}/${dailyLimit} for ${todayStr}`);

    const res = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // no client caching of API call
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[NewsAPI Guard] API returned status ${res.status}: ${errorText}`);
      return {
        success: false,
        error: `News API HTTP ${res.status}: ${res.statusText}`,
        requestsToday: usageDoc.requests,
        dailyLimit,
      };
    }

    const data: NewsApiResponse = await res.json();

    if (data.error) {
      console.error(`[NewsAPI Guard] API payload error: ${data.error.message}`);
      return {
        success: false,
        error: data.error.message,
        requestsToday: usageDoc.requests,
        dailyLimit,
      };
    }

    return {
      success: true,
      articles: data.data || [],
      requestsToday: usageDoc.requests,
      dailyLimit,
    };
  } catch (err: any) {
    console.error("[NewsAPI Guard] Unexpected error executing request:", err);
    return {
      success: false,
      error: err?.message || "Unknown News API error",
    };
  }
}

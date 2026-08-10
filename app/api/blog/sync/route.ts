import { syncBlogArticles } from "@/lib/actions/blog.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const secretParam = searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET || process.env.BLOG_SYNC_SECRET;

    // If secret is set, enforce authentication check
    if (expectedSecret) {
      const isAuthHeaderValid = authHeader === `Bearer ${expectedSecret}`;
      const isParamValid = secretParam === expectedSecret;

      if (!isAuthHeaderValid && !isParamValid) {
        return NextResponse.json(
          { error: "Unauthorized access to sync endpoint" },
          { status: 401 }
        );
      }
    }

    const result = await syncBlogArticles();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: result,
    });
  } catch (error: any) {
    console.error("Error in /api/blog/sync route:", error);
    return NextResponse.json(
      { error: error?.message || "Sync execution failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

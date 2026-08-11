"use server";

import { connectToDatabase } from "@/lib/database";
import BlogPost from "@/lib/database/models/blog.model";
import BlogSyncLock from "@/lib/database/models/blogSyncLock.model";
import NewsApiUsage from "@/lib/database/models/newsApiUsage.model";
import { fetchFromNewsApiGuarded, getDailyLimit, NewsApiArticle } from "@/lib/news-api";
import { revalidatePath } from "next/cache";

// Keywords for relevance filtering
const RELEVANT_KEYWORDS = [
  "next.js",
  "react",
  "node.js",
  "typescript",
  "javascript",
  "mern",
  "mongodb",
  "postgresql",
  "web development",
  "frontend",
  "backend",
  "full stack",
  "software engineering",
  "programming",
  "git",
  "github",
  "api",
  "ai",
  "developer",
  "cloud",
  "aws",
  "vercel",
  "docker",
  "kubernetes",
  "devops",
  "cybersecurity",
  "open source",
  "framework",
  "tech",
  "technology",
  "software",
  "code",
  "web",
  "app",
  "data",
  "system",
  "digital",
  "engineer",
  "engineering",
  "tool",
  "platform",
  "application",
];

const IRRELEVANT_KEYWORDS = [
  "politics",
  "election",
  "sports",
  "football",
  "basketball",
  "celebrity",
  "hollywood",
  "casino",
  "gambling",
  "crypto giveaway",
  "gossip",
];

// Helper: Normalize URL
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, "").toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}

// Helper: Generate clean unique slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

// Helper: Calculate reading time
function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Helper: Auto-categorize article based on title & description
function determineCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("next.js") || lower.includes("nextjs")) return "Next.js";
  if (lower.includes("react")) return "React";
  if (lower.includes("typescript")) return "TypeScript";
  if (lower.includes("node.js") || lower.includes("nodejs")) return "Node.js";
  if (lower.includes("javascript") || lower.includes("js")) return "JavaScript";
  if (lower.includes("mern") || lower.includes("mongodb") || lower.includes("postgres")) return "MERN";
  if (lower.includes("ai") || lower.includes("llm") || lower.includes("gpt")) return "AI";
  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("vercel")) return "Cloud";
  if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("devops")) return "DevOps";
  if (lower.includes("security") || lower.includes("vulnerability") || lower.includes("cyber")) return "Cybersecurity";
  if (lower.includes("open source") || lower.includes("github")) return "Open Source";
  return "Web Development";
}

// Helper: Generate developer article content from News API article
function generateDeveloperContent(article: NewsApiArticle) {
  const snippetText = article.snippet || article.description || article.title;
  const sourceName = article.source || "Tech Publication";
  const category = determineCategory(`${article.title} ${snippetText}`);

  const intro = snippetText.length > 10
    ? snippetText
    : `Recent updates and technical developments regarding ${category} have been reported by ${sourceName}.`;

  const whatHappened = `${article.title}. ${intro}`;

  const whyItMatters = `As web standards and software engineering tooling evolve, staying informed about updates in ${category} allows engineering teams to optimize performance, security, and developer efficiency.`;

  const developerImpact = `Developers using ${category} and related frameworks should evaluate how these latest updates impact current project dependencies, CI/CD pipelines, and architectural patterns.`;

  const engineeringContext = `For teams building production software, this kind of ${category} update should be evaluated through practical engineering concerns: compatibility, maintainability, deployment risk, observability, and the effect on the end-user experience. The original report gives the news signal; the engineering value comes from mapping that signal to your own application stack and delivery workflow.`;

  const implementationNotes = `Before adopting any related change, review official documentation, check active dependency versions, and test the behavior in a staging environment. If the change touches APIs, authentication, infrastructure, or build tooling, document a rollback path and monitor logs, performance metrics, and error rates after release.`;

  const businessImpact = `Technical updates matter most when they improve reliability, reduce delivery time, strengthen security, or create a clearer path for future product features. Product and engineering teams should connect the reported change to measurable outcomes instead of reacting only to the announcement.`;

  const takeaways = [
    `Key update in ${category} ecosystem reported by ${sourceName}.`,
    `Focuses on technical performance, stability, and modern development standards.`,
    `Review your project configuration to take advantage of new capabilities.`,
    `Validate compatibility and rollout risk before making production changes.`,
  ];

  const markdownContent = `
${intro}

## What Happened?

${whatHappened}

## Why It Matters

${whyItMatters}

## Developer Impact

${developerImpact}

## Engineering Context

${engineeringContext}

## Implementation Notes

${implementationNotes}

## Product & Business Impact

${businessImpact}

## Key Takeaways

${takeaways.map((t) => `- ${t}`).join("\n")}

## Source

Originally reported by **${sourceName}**.

[Read the original article on ${sourceName} →](${article.url})
`.trim();

  return {
    content: markdownContent,
    category,
    takeaways,
  };
}

/**
 * Main Automated Sync Engine
 */
export async function syncBlogArticles(options: { isManual?: boolean } = {}) {
  const stats = {
    fetched: 0,
    added: 0,
    skipped: 0,
    duplicates: 0,
    errors: 0,
    requestsToday: 0,
    dailyLimit: getDailyLimit(),
  };

  try {
    await connectToDatabase();

    // 1. Check Concurrent Sync Lock
    let lockDoc = await BlogSyncLock.findOne({ key: "global_blog_sync" });
    if (!lockDoc) {
      lockDoc = await BlogSyncLock.create({ key: "global_blog_sync", locked: false });
    }

    // Check if locked within the last 15 minutes
    if (lockDoc.locked && lockDoc.startedAt) {
      const lockAgeMs = Date.now() - new Date(lockDoc.startedAt).getTime();
      if (lockAgeMs < 15 * 60 * 1000) {
        console.warn("[Blog Sync] Sync already in progress. Aborting duplicate run.");
        return {
          ...stats,
          skipped: 1,
          message: "Sync already in progress",
        };
      }
    }

    // Acquire lock
    lockDoc.locked = true;
    lockDoc.startedAt = new Date();
    await lockDoc.save();

    // 2. Dynamic Query Selection (rotates queries to discover fresh articles)
    const SEARCH_QUERIES = [
      "software OR developer OR programming",
      "web development OR javascript OR react",
      "next.js OR typescript OR node.js",
      "ai OR cloud OR devops OR cybersecurity",
      "technology OR open source OR framework",
      "database OR mern OR fullstack",
    ];

    // Pick a query based on current 10-minute block so sequential calls hit different topics
    const queryIndex = Math.floor(Date.now() / (1000 * 60 * 10)) % SEARCH_QUERIES.length;
    const searchQuery = SEARCH_QUERIES[queryIndex];

    const apiResult = await fetchFromNewsApiGuarded({
      searchQuery,
      categories: "tech",
      limit: 10,
    });

    stats.requestsToday = apiResult.requestsToday || 0;
    stats.dailyLimit = apiResult.dailyLimit || getDailyLimit();

    if (!apiResult.success) {
      if (apiResult.blocked) {
        console.warn(`[Blog Sync] ${apiResult.reason}`);
      } else {
        console.error(`[Blog Sync] API error: ${apiResult.error}`);
        stats.errors += 1;
      }

      // Unlock and exit cleanly
      lockDoc.locked = false;
      lockDoc.lastSyncStats = { ...stats, timestamp: new Date() };
      await lockDoc.save();
      return stats;
    }

    const rawArticles = apiResult.articles || [];
    stats.fetched = rawArticles.length;

    const maxArticlesToSave = Number(process.env.BLOG_SYNC_MAX_ARTICLES || 10);

    // ── Fix N+1: batch-check all incoming articles at once before the loop ──
    const incomingUuids = rawArticles.map((a) => a.uuid).filter(Boolean);
    const incomingUrls = rawArticles.map((a) => a.url).filter(Boolean);
    const incomingSlugs = rawArticles.map((a) => generateSlug(a.title)).filter(Boolean);

    const existingDocs = await BlogPost.find({
      $or: [
        { sourceArticleId: { $in: incomingUuids } },
        { sourceUrl: { $in: incomingUrls } },
        { slug: { $in: incomingSlugs } },
      ],
    }).select("sourceArticleId sourceUrl slug").lean();

    const existingUuids = new Set(existingDocs.map((d: any) => d.sourceArticleId).filter(Boolean));
    const existingUrls = new Set(existingDocs.map((d: any) => d.sourceUrl).filter(Boolean));
    const existingSlugs = new Set(existingDocs.map((d: any) => d.slug).filter(Boolean));

    for (const article of rawArticles) {
      if (stats.added >= maxArticlesToSave) break;

      const titleLower = article.title.toLowerCase();
      const snippetLower = (article.snippet || article.description || "").toLowerCase();
      const combinedText = `${titleLower} ${snippetLower}`;

      // 3. Irrelevance Filter
      const isIrrelevant = IRRELEVANT_KEYWORDS.some((kw) => combinedText.includes(kw));
      if (isIrrelevant) {
        stats.skipped += 1;
        continue;
      }

      // 4. Relevance Filter
      const isRelevant = RELEVANT_KEYWORDS.some((kw) => combinedText.includes(kw));
      if (!isRelevant) {
        stats.skipped += 1;
        continue;
      }

      // 5. Deduplication Check (batch — no DB call per article)
      const baseSlug = generateSlug(article.title);

      const isDuplicate =
        existingUuids.has(article.uuid) ||
        existingUrls.has(article.url) ||
        existingSlugs.has(baseSlug);

      if (isDuplicate) {
        stats.duplicates += 1;
        continue;
      }

      // 6. Process & Format Article
      const { content, category } = generateDeveloperContent(article);
      const excerpt = article.snippet || article.description || article.title;
      const readingTime = calculateReadingTime(content);

      // Ensure slug uniqueness (only check DB for the rare collision case)
      let finalSlug = baseSlug;
      let counter = 1;
      while (existingSlugs.has(finalSlug) || (await BlogPost.findOne({ slug: finalSlug }).lean())) {
        finalSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }
      existingSlugs.add(finalSlug); // track within this sync run

      const publishedDate = article.published_at
        ? new Date(article.published_at)
        : new Date();

      // 7. Save to MongoDB & Auto-Publish
      await BlogPost.create({
        title: article.title,
        slug: finalSlug,
        excerpt: excerpt.substring(0, 300),
        content,
        featuredImage: article.image_url || "",
        category,
        tags: [category, "Developer Tools", "Software Engineering"],
        sourceName: article.source || "News API Tech Source",
        sourceUrl: article.url,
        sourceArticleId: article.uuid,
        originalPublishedAt: publishedDate,
        publishedAt: publishedDate,
        readingTime,
        isFeatured: stats.added === 0, // feature the first added post
        isPublished: true,
        seoTitle: `${article.title} | Tech & Developer Blog`,
        seoDescription: excerpt.substring(0, 160),
      });

      stats.added += 1;
    }

    if (stats.added > 0) {
      await setMostLatestBlogAsFeatured();
    }

    // Unlock and save stats
    lockDoc.locked = false;
    lockDoc.lastSyncStats = { ...stats, timestamp: new Date() };
    await lockDoc.save();

    try {
      revalidatePath("/blog");
      revalidatePath("/");
    } catch {}

    return stats;
  } catch (err: any) {
    console.error("[Blog Sync] Fatal error during sync execution:", err);
    stats.errors += 1;

    // Release lock on error
    try {
      await BlogSyncLock.updateOne(
        { key: "global_blog_sync" },
        { locked: false, "lastSyncStats.errors": stats.errors, "lastSyncStats.timestamp": new Date() }
      );
    } catch {}

    return stats;
  }
}

/**
 * Public: Get paged blog posts with category and search query filters
 */
export async function getAllBlogPosts({
  query = "",
  category = "All",
  page = 1,
  limit = 9,
}: {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectToDatabase();

    const filter: any = { isPublished: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (query && query.trim()) {
      filter.$text = { $search: query.trim() };
    }

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      BlogPost.find(filter)
        .select("-content") // omit large content field for listing
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPosts / limit) || 1;

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      totalPages,
      currentPage: page,
      totalPosts,
    };
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error);
    return { posts: [], totalPages: 1, currentPage: 1, totalPosts: 0 };
  }
}

/**
 * Public: Get single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error);
    return null;
  }
}

/**
 * Public: Get related blog posts for internal linking
 */
export async function getRelatedBlogPosts({
  category,
  currentSlug,
  limit = 3,
}: {
  category: string;
  currentSlug: string;
  limit?: number;
}) {
  try {
    await connectToDatabase();

    // Single query: prefer same-category posts, fall back to latest — no second DB call
    const posts = await BlogPost.find({
      $or: [
        { category, slug: { $ne: currentSlug }, isPublished: true },
        { slug: { $ne: currentSlug }, isPublished: true },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(limit * 2) // fetch extra to allow dedup across $or branches
      .select("-content")
      .lean();

    // Deduplicate while preserving category-first order
    const seen = new Set<string>();
    const sameCat: typeof posts = [];
    const others: typeof posts = [];
    for (const p of posts) {
      const id = String(p._id);
      if (seen.has(id)) continue;
      seen.add(id);
      if (p.category === category) sameCat.push(p);
      else others.push(p);
    }
    const result = [...sameCat, ...others].slice(0, limit);

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error in getRelatedBlogPosts:", error);
    return [];
  }
}


/**
 * Public: Get latest blog posts for homepage
 */
export async function getLatestBlogPosts(limit = 4) {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ isPublished: true })
      .select("-content") // omit large content field for homepage listing
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error in getLatestBlogPosts:", error);
    return [];
  }
}


/**
 * Admin: Get News API Usage, Sync Lock & Status
 */
export async function getBlogSyncStatus() {
  try {
    await connectToDatabase();

    const todayStr = new Date().toISOString().split("T")[0];
    const dailyLimit = getDailyLimit();

    const todayUsageDoc: any = await NewsApiUsage.findOne({ date: todayStr }).lean();
    const requestsToday = todayUsageDoc ? (todayUsageDoc.requests || 0) : 0;

    // Monthly total count
    const monthPrefix = todayStr.substring(0, 7); // YYYY-MM
    const monthDocs: any[] = await NewsApiUsage.find({ date: { $regex: `^${monthPrefix}` } }).lean();
    const requestsMonth = monthDocs.reduce((acc: number, curr: any) => acc + (curr.requests || 0), 0);

    const lockDoc: any = await BlogSyncLock.findOne({ key: "global_blog_sync" }).lean();
    const totalPublishedPosts = await BlogPost.countDocuments({ isPublished: true });

    return {
      requestsToday,
      dailyLimit,
      requestsMonth,
      isLocked: lockDoc ? Boolean(lockDoc.locked) : false,
      lastSyncStats: lockDoc?.lastSyncStats || null,
      totalPublishedPosts,
      status: requestsToday >= dailyLimit ? "Limit Reached" : "Safe",
    };
  } catch (error) {
    console.error("Error in getBlogSyncStatus:", error);
    return {
      requestsToday: 0,
      dailyLimit: getDailyLimit(),
      requestsMonth: 0,
      isLocked: false,
      lastSyncStats: null,
      totalPublishedPosts: 0,
      status: "Error",
    };
  }
}

/**
 * Admin: Update blog post details
 */
export async function updateBlogPost(id: string, updateData: any) {
  try {
    await connectToDatabase();
    const updated = await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/dashboard/blog");
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.error("Error in updateBlogPost:", error);
    throw error;
  }
}

/**
 * Admin: Delete blog post
 */
export async function deleteBlogPost(id: string) {
  try {
    await connectToDatabase();
    await BlogPost.findByIdAndDelete(id);
    revalidatePath("/blog");
    revalidatePath("/dashboard/blog");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteBlogPost:", error);
    throw error;
  }
}

/**
 * Admin: Trigger manual sync via Request Guard
 */
export async function triggerManualSync() {
  return await syncBlogArticles({ isManual: true });
}

/**
 * Set the most recent published blog post as the featured post
 */
export async function setMostLatestBlogAsFeatured() {
  try {
    await connectToDatabase();

    const latestPost = await BlogPost.findOne({ isPublished: true }).sort({ publishedAt: -1 });

    if (!latestPost) {
      return { success: false, message: "No published blog posts found" };
    }

    // Unfeature all posts and feature the latest post
    await BlogPost.updateMany({}, { $set: { isFeatured: false } });
    await BlogPost.findByIdAndUpdate(latestPost._id, { $set: { isFeatured: true } });

    try {
      revalidatePath("/blog");
      revalidatePath("/");
      revalidatePath("/dashboard/blog");
    } catch {}

    return {
      success: true,
      featuredPost: JSON.parse(JSON.stringify(latestPost)),
    };
  } catch (error) {
    console.error("Error in setMostLatestBlogAsFeatured:", error);
    throw error;
  }
}

/**
 * Set a specific blog post as featured
 */
export async function setFeaturedBlogPost(id: string) {
  try {
    await connectToDatabase();
    await BlogPost.updateMany({}, { $set: { isFeatured: false } });
    const updated = await BlogPost.findByIdAndUpdate(id, { $set: { isFeatured: true } }, { new: true });
    try {
      revalidatePath("/blog");
      revalidatePath("/");
      revalidatePath("/dashboard/blog");
    } catch {}
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.error("Error in setFeaturedBlogPost:", error);
    throw error;
  }
}

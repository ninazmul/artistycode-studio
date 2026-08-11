"use client";

import { useEffect, useState } from "react";
import {
  getBlogSyncStatus,
  getAllBlogPosts,
  triggerManualSync,
  deleteBlogPost,
  updateBlogPost,
  setMostLatestBlogAsFeatured,
  setFeaturedBlogPost,
} from "@/lib/actions/blog.actions";
import {
  BookOpen,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [status, postsData] = await Promise.all([
        getBlogSyncStatus(),
        getAllBlogPosts({ limit: 50 }),
      ]);
      setSyncStatus(status);
      setPosts(postsData.posts || []);
    } catch (err) {
      console.error("Failed to load blog status:", err);
      toast.error("Failed to load blog status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    toast.loading("Running News API guarded sync...", { id: "sync" });
    try {
      const res: any = await triggerManualSync();
      if (res.skipped && res.message) {
        toast.error(`Sync skipped: ${res.message}`, { id: "sync" });
      } else if (res.errors && res.added === 0) {
        toast.error("Sync completed with warnings or request limit reached", { id: "sync" });
      } else if (res.added > 0) {
        toast.success(`Sync successful! Added ${res.added} new articles (${res.duplicates} duplicates, ${res.skipped} filtered)`, { id: "sync" });
      } else if (res.duplicates > 0) {
        toast.success(`Sync complete: All ${res.fetched} articles fetched were already in MongoDB (0 new)`, { id: "sync" });
      } else if (res.skipped > 0) {
        toast.success(`Sync complete: ${res.skipped} articles fetched were filtered out as off-topic`, { id: "sync" });
      } else {
        toast.error("No articles found from News API for this query", { id: "sync" });
      }
      await fetchData();
    } catch (err: any) {
      toast.error(err?.message || "Manual sync failed", { id: "sync" });
    } finally {
      setSyncing(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      await updateBlogPost(id, { isPublished: !currentPublished });
      toast.success(currentPublished ? "Article unpublished" : "Article published");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSetLatestFeatured = async () => {
    try {
      const res = await setMostLatestBlogAsFeatured();
      if (res.success && res.featuredPost) {
        toast.success(`Featured latest post: "${res.featuredPost.title}"`);
        fetchData();
      } else {
        toast.error(res.message || "Failed to set featured post");
      }
    } catch (err) {
      toast.error("Failed to set latest blog as featured");
    }
  };

  const handleSetFeatured = async (id: string, title: string) => {
    try {
      await setFeaturedBlogPost(id);
      toast.success(`Set "${title}" as featured post`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update featured post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteBlogPost(id);
      toast.success("Article deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="p-6 md:p-10 text-white space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              AUTOMATION CENTER
            </span>
          </div>
          <h1 className="text-3xl font-black italic tracking-tight text-shine">
            Blog Sync & Usage Monitor
          </h1>
          <p className="text-sm text-white/40 font-light mt-1">
            Track News API free-tier request limits, monitor cron status, and manage published technical articles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSetLatestFeatured}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-widest hover:bg-amber-500/10 transition-all shrink-0"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Set Latest as Featured
          </button>

          <button
            onClick={handleManualSync}
            disabled={syncing || syncStatus?.status === "Limit Reached"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-all shadow-lg shadow-white/10 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Now (Guarded)"}
          </button>
        </div>
      </div>

      {/* Usage & Lock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
            TODAY&apos;S REQUESTS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black italic text-shine">
              {syncStatus?.requestsToday ?? 0} / {syncStatus?.dailyLimit ?? 10}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                syncStatus?.status === "Limit Reached"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {syncStatus?.status || "Safe"}
            </span>
          </div>
          <p className="text-xs text-white/30 font-light">
            Internal safety cap: {syncStatus?.dailyLimit ?? 10} req/day
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
            MONTHLY REQUESTS
          </span>
          <span className="text-3xl font-black italic text-shine block">
            {syncStatus?.requestsMonth ?? 0}
          </span>
          <p className="text-xs text-white/30 font-light">
            Cumulative News API calls this month
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
            PUBLISHED ARTICLES
          </span>
          <span className="text-3xl font-black italic text-shine block">
            {syncStatus?.totalPublishedPosts ?? 0}
          </span>
          <p className="text-xs text-white/30 font-light">
            Indexed articles in MongoDB
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
            SYNC LOCK
          </span>
          <span className="text-2xl font-bold text-white block">
            {syncStatus?.isLocked ? "Locked (Running)" : "Unlocked (Idle)"}
          </span>
          <p className="text-xs text-white/30 font-light">
            Prevents duplicate concurrent runs
          </p>
        </div>
      </div>

      {/* Last Sync Stats Banner */}
      {syncStatus?.lastSyncStats && (
        <div className="glass p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
            LAST SYNC EXECUTION RESULTS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-3 rounded-xl glass bg-white/[0.01]">
              <span className="text-xs text-white/40 block">Fetched</span>
              <span className="text-xl font-bold text-white">{syncStatus.lastSyncStats.fetched || 0}</span>
            </div>
            <div className="p-3 rounded-xl glass bg-white/[0.01]">
              <span className="text-xs text-white/40 block">Added</span>
              <span className="text-xl font-bold text-emerald-400">{syncStatus.lastSyncStats.added || 0}</span>
            </div>
            <div className="p-3 rounded-xl glass bg-white/[0.01]">
              <span className="text-xs text-white/40 block">Duplicates</span>
              <span className="text-xl font-bold text-yellow-400">{syncStatus.lastSyncStats.duplicates || 0}</span>
            </div>
            <div className="p-3 rounded-xl glass bg-white/[0.01]">
              <span className="text-xs text-white/40 block">Filtered</span>
              <span className="text-xl font-bold text-white/60">{syncStatus.lastSyncStats.skipped || 0}</span>
            </div>
            <div className="p-3 rounded-xl glass bg-white/[0.01]">
              <span className="text-xs text-white/40 block">Errors</span>
              <span className="text-xl font-bold text-red-400">{syncStatus.lastSyncStats.errors || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Management Table */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Published Articles</h2>
          <Link href="/blog" target="_blank" className="text-xs font-bold text-cyan-400 flex items-center gap-1">
            View Public Blog <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/5 uppercase text-[10px] tracking-wider text-white/40 font-bold border-b border-white/10">
              <tr>
                <th className="p-4">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Source</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={48}
                          height={36}
                          className="rounded-lg object-cover w-12 h-9 border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-white/30" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-bold text-white hover:text-cyan-400 transition-colors line-clamp-1 max-w-md"
                          >
                            {post.title}
                          </Link>
                          {post.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-white/30">{post.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {post.category}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-white/50">{post.sourceName}</td>

                  <td className="p-4 text-xs text-white/50">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    {post.isFeatured ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-300" />
                        Featured
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetFeatured(post._id, post.title)}
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 bg-white/5 text-white/50 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/30 border border-white/10 transition-all"
                        title="Set as featured post"
                      >
                        <Star className="w-3 h-3" />
                        Feature
                      </button>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(post._id, post.isPublished)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mx-auto ${
                        post.isPublished
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/10 text-white/40 border border-white/10"
                      }`}
                    >
                      {post.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {post.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-lg glass text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {posts.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40 font-light">
                    No blog articles stored in MongoDB. Click &quot;Sync Now&quot; to run guarded fetch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

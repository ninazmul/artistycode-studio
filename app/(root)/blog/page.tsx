import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/actions/blog.actions";
import { BookOpen, Calendar, Clock, Search, Tag, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech & Developer Blog | ArtistyCode Studio",
  description:
    "Explore latest technology updates, engineering insights, and practical guides on JavaScript, TypeScript, React, Next.js, Node.js, MERN, AI, and Cloud Architecture.",
  keywords: [
    "Tech Blog",
    "Developer Blog",
    "Next.js tutorials",
    "React updates",
    "TypeScript engineering",
    "Node.js architecture",
    "MERN stack blog",
    "AI development news",
    "Software Engineering Insights",
    "ArtistyCode Studio",
  ],
  alternates: {
    canonical: "https://www.artistycode.studio/blog",
  },
  openGraph: {
    title: "Tech & Developer Blog | ArtistyCode Studio",
    description:
      "Latest technical insights, framework updates, and architectural guides for modern software engineers.",
    url: "https://www.artistycode.studio/blog",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "https://www.artistycode.studio/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio Tech Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech & Developer Blog | ArtistyCode Studio",
    description:
      "Latest technical insights, framework updates, and architectural guides for modern software engineers.",
    images: ["/assets/og-image.png"],
  },
};

const CATEGORIES = [
  "All",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "MERN",
  "Web Development",
  "AI",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "Open Source",
];

interface BlogPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";
  const category = resolvedParams.category || "All";
  const currentPage = Number(resolvedParams.page) || 1;

  const { posts, totalPages, totalPosts } = await getAllBlogPosts({
    query,
    category,
    page: currentPage,
    limit: 9,
  });

  const featuredPost = posts.find((p: any) => p.isFeatured) || posts[0];
  const regularPosts = featuredPost
    ? posts.filter((p: any) => p._id !== featuredPost._id)
    : posts;

  return (
    <section className="bg-black-100 text-white relative overflow-hidden pt-40 pb-32 min-h-screen">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/60">
              DEVELOPER PUBLICATION
            </p>
          </div>
          <h1 className="heading mb-6 italic">TECH & DEVELOPMENT</h1>
          <p className="text-white/45 text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Latest insights, updates, and practical technical knowledge for modern developers and software engineers.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="w-full max-w-4xl mx-auto mb-16 space-y-6">
          {/* Search Bar */}
          <form method="GET" action="/blog" className="relative w-full">
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full pl-12 pr-28 py-4 glass rounded-2xl border border-white/10 bg-white/[0.02] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            {category !== "All" && (
              <input type="hidden" name="category" value={category} />
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/80 transition-all"
            >
              Search
            </button>
          </form>

          {/* Category Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              const params = new URLSearchParams();
              if (cat !== "All") params.set("category", cat);
              if (query) params.set("query", query);
              const href = `/blog${params.toString() ? `?${params.toString()}` : ""}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isSelected
                      ? "bg-white text-black font-bold shadow-lg shadow-white/15 scale-105"
                      : "glass border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Hero Article (Only on page 1 with no search query) */}
        {currentPage === 1 && !query && category === "All" && featuredPost && (
          <div className="w-full mb-16">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative block glass rounded-3xl border border-white/10 overflow-hidden hover:border-white/25 transition-all duration-500 hover:bg-white/[0.02]"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center p-6 md:p-10">
                {/* Image */}
                <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                  {featuredPost.featuredImage ? (
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white/[0.05] to-transparent">
                      <BookOpen className="w-16 h-16 text-white/20 mb-3" />
                      <span className="text-xs uppercase font-bold tracking-[0.2em] text-white/40">
                        {featuredPost.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-400 text-black text-[10px] font-black uppercase tracking-widest">
                      FEATURED STORY
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-4">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-widest">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/30" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-white/30" />
                      {featuredPost.readingTime || "4 min"}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white group-hover:text-shine transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm md:text-base text-white/50 leading-relaxed font-light line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs text-white/30 font-light flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Source: {featuredPost.sourceName}
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Full Story →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {regularPosts.map((post: any) => {
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "";

              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.03] flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[16/9] border-b border-white/5 bg-white/[0.02]">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white/[0.03] to-transparent">
                        <BookOpen className="w-10 h-10 text-white/20 mb-2 group-hover:text-white/40 transition-colors" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
                          {post.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold tracking-tight mb-3 group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-white/45 leading-relaxed font-light line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-white/30" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-white/30" />
                          {post.readingTime || "3 min"}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/30 group-hover:text-white transition-colors">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass p-16 rounded-2xl text-center border-dashed border-white/10 max-w-xl mx-auto w-full my-12">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
              {query
                ? `No published articles matched your search "${query}". Try searching with a different term.`
                : `No articles published yet under category "${category}". Automated sync runs daily.`}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs"
            >
              Reset Filters
            </Link>
          </div>
        )}

        {/* Server-Side Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}${category !== "All" ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
                className="px-5 py-2.5 rounded-xl glass border border-white/10 text-xs font-semibold hover:border-white/30 text-white"
              >
                ← Previous
              </Link>
            )}

            <span className="text-xs font-mono text-white/40 px-3">
              Page {currentPage} of {totalPages} ({totalPosts} total)
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}${category !== "All" ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
                className="px-5 py-2.5 rounded-xl glass border border-white/10 text-xs font-semibold hover:border-white/30 text-white"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

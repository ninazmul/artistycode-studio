import Link from "next/link";
import { getLatestBlogPosts } from "@/lib/actions/blog.actions";
import { ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import BlogImage from "@/components/BlogImage";

export default async function LatestBlogPosts() {
  const posts = await getLatestBlogPosts(3);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="blog-section" className="py-24 bg-black-100 text-white relative overflow-hidden">
      {/* Radial lighting background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/60">
                TECH & DEVELOPER INSIGHTS
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-shine italic text-left">
              LATEST FROM<br />THE BLOG
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-white/40 max-w-sm text-base font-light leading-relaxed md:text-right">
              Practical technical knowledge, architecture updates, and software engineering insights.
            </p>
            <Link href="/blog">
              <button className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors duration-300 group">
                View All Articles
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => {
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
                className="group block glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.03] flex flex-col"
              >
                {/* Image or Text Card Container */}
                <div className="relative overflow-hidden aspect-[16/9] border-b border-white/5 bg-white/[0.02]">
                  {post.featuredImage ? (
                    <BlogImage
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      category={post.category}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white/[0.03] to-transparent">
                      <BookOpen className="w-10 h-10 text-white/20 mb-2 group-hover:text-white/40 transition-colors" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
                        {post.category}
                      </span>
                    </div>
                  )}
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight mb-3 group-hover:text-white transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/45 leading-relaxed font-light line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Meta Footer */}
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

        {/* Mobile View All */}
        <div className="flex md:hidden justify-center mt-12">
          <Link href="/blog">
            <button className="px-6 py-3 rounded-xl glass border border-white/15 text-xs font-bold uppercase tracking-widest text-white">
              View All Articles →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/actions/blog.actions";
import AdSense from "@/components/AdSense";
import BlogImage from "@/components/BlogImage";

import {
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getWordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function buildDisplayContent(post: any) {
  const content = typeof post.content === "string" ? post.content.trim() : "";

  if (getWordCount(content) >= 650) {
    return content;
  }

  const topic = post.category || "Web Development";
  const sourceName = post.sourceName || "the original publication";
  const excerpt = post.excerpt || post.title;
  const tags = Array.isArray(post.tags) && post.tags.length > 0
    ? post.tags.join(", ")
    : topic;

  const supplementalContent = `
## Engineering Context

This article is part of the ${topic} coverage on ArtistyCode Studio. The source report from ${sourceName} highlights: ${excerpt}

For developers and technical decision makers, the important question is not only what changed, but how that change affects application architecture, delivery speed, maintainability, and production risk. Teams should review the update against their current stack, active dependencies, deployment workflow, monitoring setup, and user-facing performance goals.

## What To Review

- Check whether this update affects frontend rendering, backend APIs, infrastructure, security posture, or developer tooling.
- Compare the reported change with your current project dependencies and release schedule.
- Review documentation, changelogs, and migration notes before adopting any new API or workflow.
- Validate the impact in a staging environment before changing production systems.

## Practical Developer Notes

When evaluating ${topic} news, focus on measurable outcomes: build performance, runtime stability, accessibility, SEO, maintainability, and the cost of future changes. A useful update should either remove friction from the development workflow, improve user experience, reduce operational risk, or make the product easier to evolve.

If the topic relates to frameworks or libraries, check version compatibility and breaking changes. If it relates to AI, cloud, DevOps, or security, review data handling, permission boundaries, cost impact, observability, and rollback options. Small implementation details often matter more than the announcement itself.

## Key Terms

${tags
  .split(",")
  .map((tag: string) => `- ${tag.trim()}`)
  .filter((tag: string) => tag.length > 2)
  .join("\n")}

## Summary

The short version: treat this as a signal to inspect your current technical choices, not as a reason to immediately change production code. Read the source article for original reporting, then map the update to your own project constraints before acting.
`.trim();

  return `${content}\n\n${supplementalContent}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | ArtistyCode Blog",
      description: "The requested blog article does not exist or has been removed.",
    };
  }

  const url = `https://www.artistycode.studio/blog/${post.slug}`;
  const title = post.seoTitle || `${post.title} | Tech & Developer Blog`;
  const description = post.seoDescription || post.excerpt;
  const image = post.featuredImage || "https://www.artistycode.studio/assets/og-image.png";

  return {
    title,
    description,
    keywords: [post.category, ...(post.tags || []), "Tech Blog", "ArtistyCode Studio"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ArtistyCode Studio",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts({
    category: post.category,
    currentSlug: post.slug,
    limit: 3,
  });
  const displayContent = buildDisplayContent(post);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.sourceName || "ArtistyCode Studio",
      url: "https://www.artistycode.studio",
    },
    publisher: {
      "@type": "Organization",
      name: "ArtistyCode Studio",
      url: "https://www.artistycode.studio",
      logo: {
        "@type": "ImageObject",
        url: "https://www.artistycode.studio/assets/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.artistycode.studio/blog/${post.slug}`,
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.artistycode.studio",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.artistycode.studio/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `https://www.artistycode.studio/blog?category=${encodeURIComponent(post.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `https://www.artistycode.studio/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="bg-black-100 text-white relative overflow-hidden pt-36 pb-32 min-h-screen">
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] lighting-radial opacity-20" />
        </div>

        <div className="wrapper relative z-10 max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="hover:text-white transition-colors"
            >
              {post.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
            <span className="text-white/60 truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>

          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </Link>
          </div>

          {/* Meta Header */}
          <header className="mb-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
              <span className="px-3.5 py-1.5 rounded-full glass border border-white/15 text-[11px] font-bold text-white uppercase tracking-widest bg-white/[0.04]">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-white/30" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white/30" />
                {post.readingTime || "3 min read"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15]">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed">
              {post.excerpt}
            </p>

            {/* Source Attribution Badge */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
              <span className="text-white/40 font-light">
                Originally reported by <strong className="text-white font-medium">{post.sourceName}</strong>
              </span>
              {post.sourceUrl && (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Source Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] mb-12 shadow-2xl">
              <BlogImage
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Top AdSense Unit */}
          <AdSense className="my-8" />

          {/* Article Body Content */}
          <div className="max-w-none space-y-8 text-white/80 leading-8 md:leading-9 font-light text-base md:text-lg break-words [overflow-wrap:anywhere]">
            {displayContent.split("\n\n").map((paragraph: string, idx: number) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-2xl md:text-3xl font-bold tracking-tight text-white pt-8 pb-3 border-b border-white/10 italic leading-tight"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl md:text-2xl font-semibold tracking-tight text-white pt-4 pb-1 leading-tight"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                const listItems = paragraph.split("\n- ").map((item) => item.replace("- ", ""));
                return (
                  <ul key={idx} className="space-y-3 my-4">
                    {listItems.map((li, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="min-w-0 leading-8">{li}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith("[Read the original article")) {
                return null; // rendered in source card below
              }
              return (
                <p key={idx} className="leading-8 md:leading-9">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Mid Article AdSense Placement */}
          <AdSense className="my-12" />

          {/* Source Attribution Card */}
          {post.sourceUrl && (
            <div className="my-12 glass p-8 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30 block mb-1">
                  ORIGINAL REPORTING
                </span>
                <h4 className="text-base font-bold text-white">
                  Originally reported by {post.sourceName}
                </h4>
                <p className="text-xs text-white/40 font-light mt-1">
                  Explore full third-party context and original coverage.
                </p>
              </div>

              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2 shrink-0"
              >
                Read Original Article
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Related Articles Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-white/10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30 block mb-1">
                    KEEP READING
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    Related Articles
                  </h3>
                </div>
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                >
                  More in {post.category} →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related: any) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group block glass p-6 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/[0.03] transition-all"
                  >
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                      {related.category}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-shine line-clamp-2 mb-3">
                      {related.title}
                    </h4>
                    <p className="text-xs text-white/40 line-clamp-2 font-light">
                      {related.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}

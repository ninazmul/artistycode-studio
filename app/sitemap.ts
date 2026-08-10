import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/database";
import BlogPost from "@/lib/database/models/blog.model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.artistycode.studio";

  // Static routes
  const routes = [
    "",
    "/about",
    "/projects",
    "/resources",
    "/testimonials",
    "/contact",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Blog Posts
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ isPublished: true }, "slug updatedAt publishedAt")
      .lean();

    const blogRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}

import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
}

async function main() {
  const { connectToDatabase } = await import("@/lib/database");
  const { default: BlogPost } = await import("@/lib/database/models/blog.model");

  await connectToDatabase();
  console.log("Connected to MongoDB (artistycodestudio database).");

  // Find all published posts sorted by publishedAt descending
  const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 });

  console.log(`Found ${posts.length} published blog posts in total.`);

  if (posts.length === 0) {
    console.log("No published blog posts found.");
    process.exit(0);
  }

  const latestPost = posts[0];
  console.log(`\n=== LATEST BLOG POST ===`);
  console.log(`ID: ${latestPost._id}`);
  console.log(`Title: ${latestPost.title}`);
  console.log(`Published At: ${latestPost.publishedAt}`);
  console.log(`Current isFeatured: ${latestPost.isFeatured}`);
  console.log(`=======================\n`);

  // Un-feature all posts
  await BlogPost.updateMany({}, { $set: { isFeatured: false } });

  // Feature the latest post
  await BlogPost.findByIdAndUpdate(latestPost._id, { $set: { isFeatured: true } });

  console.log(`SUCCESS: Set "${latestPost.title}" as the only featured blog post.`);

  // List top 5 recent posts to verify
  const updatedPosts = await BlogPost.find({ isPublished: true })
    .select("title publishedAt isFeatured")
    .sort({ publishedAt: -1 })
    .limit(5);

  console.log("\nTop 5 Most Recent Posts:");
  updatedPosts.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.isFeatured ? "FEATURED" : "NORMAL"}] ${p.title} (${p.publishedAt})`);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Error setting featured blog:", err);
  process.exit(1);
});

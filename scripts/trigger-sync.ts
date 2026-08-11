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
  console.log("MONGODB_URI loaded:", !!process.env.MONGODB_URI);
  const { syncBlogArticles } = await import("@/lib/actions/blog.actions");
  console.log("Triggering syncBlogArticles()...");
  const result = await syncBlogArticles({ isManual: true });
  console.log("Sync result:", result);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error in sync:", err);
  process.exit(1);
});

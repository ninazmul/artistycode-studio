import { Schema, model, models, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  sourceArticleId?: string;
  originalPublishedAt?: Date;
  publishedAt: Date;
  readingTime: string;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    sourceName: { type: String, required: true, default: "ArtistyCode Engineering" },
    sourceUrl: { type: String, required: true, unique: true, index: true },
    sourceArticleId: { type: String, index: true },
    originalPublishedAt: { type: Date },
    publishedAt: { type: Date, default: Date.now, index: true },
    readingTime: { type: String, default: "3 min read" },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

// Search index on title, excerpt, tags, category
BlogPostSchema.index({
  title: "text",
  excerpt: "text",
  tags: "text",
  category: "text",
});

const BlogPost = models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;

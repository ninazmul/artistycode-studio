import { Schema, model, models, Document } from "mongoose";

export interface IBlogSyncLock extends Document {
  key: string;
  locked: boolean;
  startedAt?: Date;
  lastSyncStats?: {
    fetched: number;
    added: number;
    skipped: number;
    duplicates: number;
    errors: number;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogSyncLockSchema = new Schema<IBlogSyncLock>(
  {
    key: { type: String, required: true, unique: true, index: true, default: "global_blog_sync" },
    locked: { type: Boolean, default: false },
    startedAt: { type: Date },
    lastSyncStats: {
      fetched: { type: Number, default: 0 },
      added: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 },
      duplicates: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      timestamp: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const BlogSyncLock =
  models.BlogSyncLock ||
  model<IBlogSyncLock>("BlogSyncLock", BlogSyncLockSchema);

export default BlogSyncLock;

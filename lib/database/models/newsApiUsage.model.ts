import { Schema, model, models, Document } from "mongoose";

export interface INewsApiUsage extends Document {
  date: string; // YYYY-MM-DD
  requests: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsApiUsageSchema = new Schema<INewsApiUsage>(
  {
    date: { type: String, required: true, unique: true, index: true },
    requests: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const NewsApiUsage =
  models.NewsApiUsage ||
  model<INewsApiUsage>("NewsApiUsage", NewsApiUsageSchema);

export default NewsApiUsage;

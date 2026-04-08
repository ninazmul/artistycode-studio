import { Document, Schema, Types, model, models } from "mongoose";

export interface IResource extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  stack: string;
  image: string;
  url: string;
  file: string;
  price: string;
  isFree: boolean;
  category: string;
  author: string;
}

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  stack: { type: String },
  image: { type: String, required: true },
  url: { type: String },
  file: { type: String, required: true },
  price: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  category: { type: String, required: true },
  author: { type: String, required: true },
});

const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;

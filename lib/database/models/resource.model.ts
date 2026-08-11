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
  isFree: { type: Boolean, default: false, index: true },
  category: { type: String, required: true, index: true },
  author: { type: String, required: true },
}, { timestamps: true });

// Compound index for filtered+sorted resource listing
ResourceSchema.index({ isFree: 1, category: 1, _id: -1 });


const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;

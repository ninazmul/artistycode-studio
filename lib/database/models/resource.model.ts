import { Document, Schema, model, models } from "mongoose";

export interface IResource extends Document {
  _id: string;
  heading: string;
  image: string;
  link: string;
  category: string;
}

const ResourceSchema = new Schema({
  heading: { type: String, required: true, unique: true },
  image: { type: String, required: true, unique: true },
  link: { type: String, required: true, unique: true },
  category: { type: String, required: true },
});

const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;

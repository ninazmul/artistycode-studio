import { Document, Schema, Types, model, models } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  stack: string;
  image: string;
  url: string;
  category: string;
  author: string;
}

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  stack: { type: String },
  image: { type: String, required: true },
  url: { type: String },
  category: { type: String, required: true, index: true },
  author: { type: String, required: true },
}, { timestamps: true });

// Compound index for sorted category queries
ProjectSchema.index({ category: 1, _id: -1 });


const Project = models.Project || model("Project", ProjectSchema);

export default Project;

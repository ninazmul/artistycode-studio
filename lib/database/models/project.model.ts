import { Document, Schema, model, models } from "mongoose";

export interface IProject extends Document {
  _id: string;
  title: string;
  description?: string;
  stack: string;
  image: string;
  url: string;
  category: string;
}

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  stack: { type: String },
  image: { type: String, required: true },
  url: { type: String },
  category: { type: String, required: true },
});

const Project = models.Project || model("Project", ProjectSchema);

export default Project;

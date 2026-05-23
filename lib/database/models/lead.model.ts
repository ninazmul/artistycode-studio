import { Document, Schema, Types, model, models } from "mongoose";

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: Date;
}

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, default: "" },
  status: { type: String, default: "Pending" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Lead = models.Lead || model("Lead", LeadSchema);

export default Lead;

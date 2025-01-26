import { Document, Schema, model, models } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  name: string;
  email: string;
}

const AdminSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;

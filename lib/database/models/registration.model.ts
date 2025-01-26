import { Document, Schema, model, models } from "mongoose";

export interface IRegistration extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  number: string;
  email: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  signature: string;
  date: Date;
  status: string;
  userId: string;
}

const RegistrationSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyContactNumber: { type: String, required: true },
  emergencyContactRelation: { type: String, required: true },
  signature: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true },
  userId: { type: String },
});

const Registration =
  models.Registration || model("Registration", RegistrationSchema);

export default Registration;

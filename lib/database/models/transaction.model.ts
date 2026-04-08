import { Document, Schema, Types, model, models } from "mongoose";

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  date: Date;
  project: string;
  category: string;
  amount: string;
  due_amount?: string;
  notes?: string;
}

const TransactionSchema = new Schema({
  date: { type: Date, default: Date.now },
  project: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: String, required: true },
  due_amount: { type: String },
  notes: { type: String },
});

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;

import { Document, Schema, Types, model, models } from "mongoose";

export interface IMilestoneInvoice {
  invoiceNumber: string;
  milestone: number; // 1: Kickoff (30%), 2: Midpoint (40%), 3: Delivery (30%)
  title: string;
  percentage: number;
  baseAmount: number;
  deadline: Date;
  status: "Draft" | "Sent" | "Overdue" | "Paid";
  paidAt?: Date;
  paidAmount?: number;
  lateFeePercentage: number; // Increments by 2% every 7 days overdue
  lateFeeAmount: number;
  totalDue: number;
  lastReminderSentAt?: Date;
  warningCount: number;
}

export interface IQuotationFeature {
  title: string;
  description: string;
  estimatedDays?: number;
}

export interface IQuotationSignature {
  signedByName: string;
  signerEmail: string;
  signedAt: Date;
  signatureDataUrl: string; // Base64 data URL from canvas
  signerIp?: string;
}

export interface IQuotation extends Document {
  _id: Types.ObjectId;
  quotationNumber: string;
  title: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  category: string;
  currency: "USD" | "BDT";
  totalBudget: number;
  features: IQuotationFeature[];
  agreementText?: string;
  status: "Draft" | "Sent" | "Signed" | "Active" | "Completed" | "Cancelled";
  signature?: IQuotationSignature;
  invoices: IMilestoneInvoice[];
  createdBy: string; // User/Admin ID
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneInvoiceSchema = new Schema<IMilestoneInvoice>({
  invoiceNumber: { type: String, required: true },
  milestone: { type: Number, required: true },
  title: { type: String, required: true },
  percentage: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Draft", "Sent", "Overdue", "Paid"],
    default: "Draft",
    index: true,
  },
  paidAt: { type: Date },
  paidAmount: { type: Number },
  lateFeePercentage: { type: Number, default: 0 },
  lateFeeAmount: { type: Number, default: 0 },
  totalDue: { type: Number, required: true },
  lastReminderSentAt: { type: Date },
  warningCount: { type: Number, default: 0 },
});

const QuotationFeatureSchema = new Schema<IQuotationFeature>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedDays: { type: Number },
});

const QuotationSignatureSchema = new Schema<IQuotationSignature>({
  signedByName: { type: String, required: true },
  signerEmail: { type: String, required: true },
  signedAt: { type: Date, default: Date.now },
  signatureDataUrl: { type: String, required: true },
  signerIp: { type: String },
});

const QuotationSchema = new Schema<IQuotation>(
  {
    quotationNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    category: { type: String, default: "Custom Software" },
    currency: { type: String, enum: ["USD", "BDT"], default: "USD" },
    totalBudget: { type: Number, required: true },
    features: [QuotationFeatureSchema],
    agreementText: { type: String },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Signed", "Active", "Completed", "Cancelled"],
      default: "Sent",
      index: true,
    },
    signature: QuotationSignatureSchema,
    invoices: [MilestoneInvoiceSchema],
    createdBy: { type: String, default: "Admin" },
    notes: { type: String },
  },
  { timestamps: true }
);

const Quotation = models.Quotation || model<IQuotation>("Quotation", QuotationSchema);

export default Quotation;

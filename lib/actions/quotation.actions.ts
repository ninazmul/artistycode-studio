"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Quotation, {
  IQuotation,
  IMilestoneInvoice,
} from "../database/models/quotation.model";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "https://artistycode.studio";
};

// -------------------------------------------------------------
// CREATE QUOTATION & PROJECT AGREEMENT
// -------------------------------------------------------------
export interface CreateQuotationParams {
  title: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  category?: string;
  currency: "USD" | "BDT";
  totalBudget: number;
  features: { title: string; description: string; estimatedDays?: number }[];
  milestone1Deadline: Date;
  milestone2Deadline: Date;
  milestone3Deadline: Date;
  agreementText?: string;
  notes?: string;
  createdBy?: string;
}

export const createQuotation = async (params: CreateQuotationParams) => {
  try {
    await connectToDatabase();

    const timestamp = Date.now().toString().slice(-5);
    const quotationNumber = `AC-QT-${new Date().getFullYear()}-${timestamp}`;

    // 30% / 40% / 30% calculations
    const m1Amount = Math.round(params.totalBudget * 0.3 * 100) / 100;
    const m2Amount = Math.round(params.totalBudget * 0.4 * 100) / 100;
    const m3Amount =
      Math.round((params.totalBudget - m1Amount - m2Amount) * 100) / 100;

    const invoices: IMilestoneInvoice[] = [
      {
        invoiceNumber: `${quotationNumber}-INV-01`,
        milestone: 1,
        title: "30% Initial Kickoff Deposit",
        percentage: 30,
        baseAmount: m1Amount,
        deadline: new Date(params.milestone1Deadline),
        status: "Draft",
        lateFeePercentage: 0,
        lateFeeAmount: 0,
        totalDue: m1Amount,
        warningCount: 0,
      },
      {
        invoiceNumber: `${quotationNumber}-INV-02`,
        milestone: 2,
        title: "40% Midpoint Milestone (50% Completion)",
        percentage: 40,
        baseAmount: m2Amount,
        deadline: new Date(params.milestone2Deadline),
        status: "Draft",
        lateFeePercentage: 0,
        lateFeeAmount: 0,
        totalDue: m2Amount,
        warningCount: 0,
      },
      {
        invoiceNumber: `${quotationNumber}-INV-03`,
        milestone: 3,
        title: "30% Final Delivery & Handover",
        percentage: 30,
        baseAmount: m3Amount,
        deadline: new Date(params.milestone3Deadline),
        status: "Draft",
        lateFeePercentage: 0,
        lateFeeAmount: 0,
        totalDue: m3Amount,
        warningCount: 0,
      },
    ];

    const defaultAgreement =
      params.agreementText ||
      `This Professional Services Agreement is entered into by and between ArtistyCode Studio ("Developer") and ${params.companyName || params.clientName} ("Client").

1. SCOPE OF SERVICES: Developer will design, build, and deploy the project "${params.title}" according to the features agreed upon in this document.
2. PAYMENT SCHEDULE: Total contract value is ${params.currency === "BDT" ? "৳" : "$"}${params.totalBudget.toLocaleString()}. Payments are structured into 3 milestones: 30% Initial Kickoff, 40% Midpoint (50% project delivery), and 30% Final Handover upon completion.
3. LATE PAYMENT POLICY: Invoices are due on the specified deadline. Any invoice remaining unpaid 7 days after the deadline will incur an automatic 2% late fee penalty for every 7 days overdue until paid in full.
4. INTELLECTUAL PROPERTY: Upon 100% full payment of all project milestones, Developer irrevocably transfers all proprietary rights, source code, and assets to Client.
5. CONFIDENTIALITY & GOVERNING LAW: Both parties agree to maintain strict confidentiality of proprietary data, credentials, and business logic.`;

    const newQuotation = await Quotation.create({
      quotationNumber,
      title: params.title,
      clientName: params.clientName,
      clientEmail: params.clientEmail,
      companyName: params.companyName,
      category: params.category || "Custom Software",
      currency: params.currency,
      totalBudget: params.totalBudget,
      features: params.features,
      agreementText: defaultAgreement,
      status: "Sent",
      invoices,
      createdBy: params.createdBy || "Admin",
      notes: params.notes,
    });

    const agreementUrl = `${getBaseUrl()}/agreement/${newQuotation._id}`;

    // Send invitation email to client
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"ArtistyCode Studio" <${process.env.EMAIL_USER}>`,
        to: params.clientEmail,
        subject: `Project Quotation & Agreement: ${params.title} — ArtistyCode Studio`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0c; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 28px;">
              <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #34d399; font-weight: 600;">Official Quotation & Agreement</span>
              <h1 style="font-size: 24px; color: #ffffff; margin: 8px 0 0 0;">ArtistyCode Studio</h1>
            </div>
            
            <p style="font-size: 15px; color: #d4d4d8; line-height: 1.6;">
              Dear <strong>${params.clientName}</strong> (${params.companyName}),
            </p>
            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
              We have generated your custom quotation and project service agreement for <strong>${params.title}</strong>.
            </p>

            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #71717a; font-size: 13px;">Quote Number:</span>
                <span style="color: #ffffff; font-weight: 600; font-size: 13px;">${quotationNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #71717a; font-size: 13px;">Total Investment:</span>
                <span style="color: #34d399; font-weight: 700; font-size: 16px;">${params.currency === "BDT" ? "৳" : "$"}${params.totalBudget.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #71717a; font-size: 13px;">Payment Structure:</span>
                <span style="color: #d4d4d8; font-size: 13px;">30% Kickoff • 40% Midpoint • 30% Delivery</span>
              </div>
            </div>

            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
              Please review the project scope, milestones, and terms, and authorize the contract with your digital signature using the secure link below:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${agreementUrl}" style="background: #ffffff; color: #000000; padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block;">
                Review & Sign Agreement →
              </a>
            </div>

            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 11px; color: #71717a; text-align: center;">
              ArtistyCode Studio • High-Performance Software Development<br />
              Questions? Reply directly to this email.
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send agreement invitation email:", mailError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    return JSON.parse(JSON.stringify(newQuotation));
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// GET QUOTATION BY ID (Public & Admin)
// -------------------------------------------------------------
export const getQuotationById = async (id: string) => {
  try {
    await connectToDatabase();
    const quotation = await Quotation.findById(id).lean();
    if (!quotation) throw new Error("Quotation not found");
    return JSON.parse(JSON.stringify(quotation));
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// GET ALL QUOTATIONS
// -------------------------------------------------------------
export const getAllQuotations = async () => {
  try {
    await connectToDatabase();
    const quotations = await Quotation.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(quotations));
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// SIGN AGREEMENT (Client action with live canvas signature)
// -------------------------------------------------------------
export interface SignAgreementParams {
  quotationId: string;
  signedByName: string;
  signerEmail: string;
  signatureDataUrl: string;
  signerIp?: string;
}

export const signAgreement = async ({
  quotationId,
  signedByName,
  signerEmail,
  signatureDataUrl,
  signerIp,
}: SignAgreementParams) => {
  try {
    await connectToDatabase();

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) throw new Error("Quotation not found");
    if (
      quotation.status === "Signed" ||
      quotation.status === "Active" ||
      quotation.status === "Completed"
    ) {
      throw new Error("Agreement is already signed and locked.");
    }

    // Update signature and activate Milestone 1 invoice
    quotation.signature = {
      signedByName,
      signerEmail,
      signedAt: new Date(),
      signatureDataUrl,
      signerIp: signerIp || "Recorded",
    };
    quotation.status = "Signed";

    if (quotation.invoices && quotation.invoices.length > 0) {
      quotation.invoices[0].status = "Sent";
      quotation.invoices[0].lastReminderSentAt = new Date();
    }

    await quotation.save();

    const m1Invoice = quotation.invoices[0];
    const currSymbol = quotation.currency === "BDT" ? "৳" : "$";
    const invoiceUrl = `${getBaseUrl()}/invoice/${quotation._id}/1`;

    // Send confirmation email with Invoice #1 (30%)
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"ArtistyCode Studio" <${process.env.EMAIL_USER}>`,
        to: quotation.clientEmail,
        subject: `Agreement Signed & Invoice #1: ${quotation.title} — ArtistyCode Studio`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0c; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: rgba(52, 211, 153, 0.15); color: #34d399; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(52, 211, 153, 0.3);">
                ✓ Agreement Executed & Signed
              </div>
              <h1 style="font-size: 22px; color: #ffffff; margin: 12px 0 0 0;">Project Kickoff Confirmed</h1>
            </div>

            <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
              Thank you, <strong>${signedByName}</strong>. Your project agreement for <strong>${quotation.title}</strong> has been legally signed and countersigned.
            </p>

            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Invoice 1 of 3: Initial Kickoff (30%)</p>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #a1a1aa; font-size: 13px;">Invoice Number:</span>
                <span style="color: #ffffff; font-weight: 600; font-size: 13px;">${m1Invoice.invoiceNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #a1a1aa; font-size: 13px;">Due Date:</span>
                <span style="color: #facc15; font-weight: 600; font-size: 13px;">${new Date(m1Invoice.deadline).toLocaleDateString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">Amount Due:</span>
                <span style="color: #34d399; font-weight: 700; font-size: 18px;">${currSymbol}${m1Invoice.baseAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoiceUrl}" style="background: #ffffff; color: #000000; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block;">
                View & Pay Invoice #1 →
              </a>
            </div>

            <p style="font-size: 12px; color: #71717a; line-height: 1.5;">
              <strong>Note:</strong> Work commences immediately upon receipt of the 30% initial deposit. In accordance with Section 3 of your signed agreement, invoices unpaid after the deadline will accrue a 2% late fee penalty every 7 days.
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send signed confirmation email:", mailError);
    }

    revalidatePath(`/agreement/${quotationId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    return { success: true, message: "Agreement signed successfully." };
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// SEND MILESTONE INVOICE (40% or 30% final)
// -------------------------------------------------------------
export const sendMilestoneInvoice = async (
  quotationId: string,
  milestoneIndex: number,
) => {
  try {
    await connectToDatabase();

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) throw new Error("Quotation not found");

    const invoice = quotation.invoices[milestoneIndex];
    if (!invoice) throw new Error("Invoice milestone not found");

    invoice.status = "Sent";
    invoice.lastReminderSentAt = new Date();
    await quotation.save();

    const currSymbol = quotation.currency === "BDT" ? "৳" : "$";
    const invoiceUrl = `${getBaseUrl()}/invoice/${quotation._id}/${milestoneIndex + 1}`;

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"ArtistyCode Studio" <${process.env.EMAIL_USER}>`,
      to: quotation.clientEmail,
      subject: `Invoice #${milestoneIndex + 1} (${invoice.percentage}%): ${quotation.title} — ArtistyCode Studio`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0c; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #60a5fa; font-weight: 600;">Milestone Invoice Notification</span>
            <h1 style="font-size: 22px; color: #ffffff; margin: 8px 0 0 0;">${invoice.title}</h1>
          </div>

          <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
            Dear <strong>${quotation.clientName}</strong> (${quotation.companyName}),
          </p>
          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            We have reached a key delivery phase for <strong>${quotation.title}</strong>. Please find the details for your next milestone invoice below.
          </p>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #a1a1aa; font-size: 13px;">Invoice:</span>
              <span style="color: #ffffff; font-weight: 600; font-size: 13px;">${invoice.invoiceNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #a1a1aa; font-size: 13px;">Due Date:</span>
              <span style="color: #facc15; font-weight: 600; font-size: 13px;">${new Date(invoice.deadline).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
              <span style="color: #ffffff; font-size: 14px; font-weight: 600;">Amount Due:</span>
              <span style="color: #34d399; font-weight: 700; font-size: 18px;">${currSymbol}${invoice.totalDue.toLocaleString()}</span>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoiceUrl}" style="background: #ffffff; color: #000000; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block;">
              View & Pay Invoice →
            </a>
          </div>

          <p style="font-size: 12px; color: #71717a; text-align: center;">
            ArtistyCode Studio • Late payments past 7 days incur a 2% periodic fee.
          </p>
        </div>
      `,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    return { success: true };
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// MARK INVOICE AS PAID (Triggers Success Invoice Receipt Email)
// -------------------------------------------------------------
export const markInvoiceAsPaid = async (
  quotationId: string,
  milestoneIndex: number,
) => {
  try {
    await connectToDatabase();

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) throw new Error("Quotation not found");

    const invoice = quotation.invoices[milestoneIndex];
    if (!invoice) throw new Error("Invoice milestone not found");

    invoice.status = "Paid";
    invoice.paidAt = new Date();
    invoice.paidAmount = invoice.totalDue;

    // Check if all 3 are paid
    const allPaid = quotation.invoices.every(
      (inv: IMilestoneInvoice) => inv.status === "Paid",
    );
    if (allPaid) {
      quotation.status = "Completed";
    } else {
      quotation.status = "Active";
    }

    await quotation.save();

    const currSymbol = quotation.currency === "BDT" ? "৳" : "$";
    const receiptUrl = `${getBaseUrl()}/invoice/${quotation._id}/${milestoneIndex + 1}`;

    // Send Success Invoice Email
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"ArtistyCode Studio" <${process.env.EMAIL_USER}>`,
        to: quotation.clientEmail,
        subject: `Payment Received & Receipt: ${invoice.invoiceNumber} — ArtistyCode Studio`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0c; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: rgba(52, 211, 153, 0.15); color: #34d399; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(52, 211, 153, 0.3);">
                ✓ Payment Settled
              </div>
              <h1 style="font-size: 22px; color: #ffffff; margin: 12px 0 0 0;">Official Payment Receipt</h1>
            </div>

            <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
              Dear <strong>${quotation.clientName}</strong>,
            </p>
            <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
              We have successfully received and confirmed your payment for <strong>${invoice.title}</strong> (${quotation.title}).
            </p>

            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #a1a1aa; font-size: 13px;">Receipt / Invoice:</span>
                <span style="color: #ffffff; font-weight: 600; font-size: 13px;">${invoice.invoiceNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #a1a1aa; font-size: 13px;">Settled Date:</span>
                <span style="color: #ffffff; font-size: 13px;">${new Date().toLocaleDateString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">Amount Paid:</span>
                <span style="color: #34d399; font-weight: 700; font-size: 18px;">${currSymbol}${invoice.totalDue.toLocaleString()}</span>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${receiptUrl}" style="background: #ffffff; color: #000000; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block;">
                Download Paid Receipt →
              </a>
            </div>

            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 11px; color: #71717a; text-align: center;">
              Thank you for choosing ArtistyCode Studio. Your support drives our engineering excellence.
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send paid invoice receipt:", mailError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    revalidatePath(`/invoice/${quotation._id}/${milestoneIndex + 1}`);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// AUDIT OVERDUE INVOICES (Late Fee Calculation & Warning Emails)
// Rule:
// - If deadline passed: send warning email with invoice
// - After 7 days delay: increase 2% due fee for every 7 days until paid
// -------------------------------------------------------------
export const auditOverdueInvoices = async () => {
  try {
    await connectToDatabase();

    const now = new Date();
    // Find all quotations with signed/active status
    const quotations = await Quotation.find({
      status: { $in: ["Signed", "Active"] },
    });

    const results = {
      auditedQuotations: quotations.length,
      penaltiesApplied: 0,
      warningsSent: 0,
    };

    const transporter = getTransporter();

    for (const quotation of quotations) {
      let quotationModified = false;
      const currSymbol = quotation.currency === "BDT" ? "৳" : "$";

      for (let i = 0; i < quotation.invoices.length; i++) {
        const invoice = quotation.invoices[i];

        // Only process unpaid invoices that have been activated or reached deadline
        if (invoice.status === "Paid" || invoice.status === "Draft") continue;

        const deadline = new Date(invoice.deadline);

        if (now > deadline) {
          const diffMs = now.getTime() - deadline.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          // Calculate 7-day intervals for 2% late fee
          const sevenDayIntervals = Math.floor(diffDays / 7);
          const newLateFeePercentage = sevenDayIntervals * 2; // 2% per 7 days
          const newLateFeeAmount =
            Math.round(
              invoice.baseAmount * (newLateFeePercentage / 100) * 100,
            ) / 100;
          const newTotalDue =
            Math.round((invoice.baseAmount + newLateFeeAmount) * 100) / 100;

          // Check if penalty changed
          if (
            invoice.lateFeePercentage !== newLateFeePercentage ||
            invoice.status !== "Overdue"
          ) {
            invoice.status = "Overdue";
            invoice.lateFeePercentage = newLateFeePercentage;
            invoice.lateFeeAmount = newLateFeeAmount;
            invoice.totalDue = newTotalDue;
            quotationModified = true;
            results.penaltiesApplied++;
          }

          // Decide whether to send a warning email:
          // Send if never sent, or if at least 5 days have passed since last reminder
          const lastReminder = invoice.lastReminderSentAt
            ? new Date(invoice.lastReminderSentAt).getTime()
            : 0;
          const daysSinceReminder =
            (now.getTime() - lastReminder) / (1000 * 60 * 60 * 24);

          if (daysSinceReminder >= 5 || !invoice.lastReminderSentAt) {
            invoice.lastReminderSentAt = now;
            invoice.warningCount = (invoice.warningCount || 0) + 1;
            quotationModified = true;

            const invoiceUrl = `${getBaseUrl()}/invoice/${quotation._id}/${i + 1}`;

            try {
              await transporter.sendMail({
                from: `"ArtistyCode Studio Billing" <${process.env.EMAIL_USER}>`,
                to: quotation.clientEmail,
                subject: `OVERDUE NOTICE & LATE FEE ALERT: ${invoice.invoiceNumber} — ArtistyCode Studio`,
                html: `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0c; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(239,68,68,0.3);">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <div style="display: inline-block; background: rgba(239, 68, 68, 0.15); color: #ef4444; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(239, 68, 68, 0.3);">
                        ⚠ Urgent: Overdue Payment Notice
                      </div>
                      <h1 style="font-size: 22px; color: #ffffff; margin: 12px 0 0 0;">Payment Overdue (${diffDays} Days Late)</h1>
                    </div>

                    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
                      Dear <strong>${quotation.clientName}</strong> (${quotation.companyName}),
                    </p>
                    <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                      This is an official notice that Invoice <strong>${invoice.invoiceNumber}</strong> (${invoice.title}) passed its agreed deadline on <strong>${deadline.toLocaleDateString()}</strong>.
                    </p>

                    <div style="background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #a1a1aa; font-size: 13px;">Original Amount:</span>
                        <span style="color: #ffffff; font-size: 13px;">${currSymbol}${invoice.baseAmount.toLocaleString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #ef4444; font-size: 13px;">Late Fee Penalty (${invoice.lateFeePercentage}%):</span>
                        <span style="color: #ef4444; font-weight: 600; font-size: 13px;">+${currSymbol}${invoice.lateFeeAmount.toLocaleString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                        <span style="color: #ffffff; font-size: 14px; font-weight: 600;">Updated Total Due:</span>
                        <span style="color: #ef4444; font-weight: 700; font-size: 20px;">${currSymbol}${invoice.totalDue.toLocaleString()}</span>
                      </div>
                    </div>

                    <p style="font-size: 13px; color: #f87171; line-height: 1.5; background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px;">
                      <strong>Contract Clause 3 Notice:</strong> An additional 2% fee is assessed every 7 days overdue until the invoice is settled. Continued delinquency may result in development suspension.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${invoiceUrl}" style="background: #ef4444; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block;">
                        Pay Overdue Invoice Immediately →
                      </a>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 11px; color: #71717a; text-align: center;">
                      If you have already sent payment, please contact our billing department immediately with the transaction reference.
                    </div>
                  </div>
                `,
              });
              results.warningsSent++;
            } catch (mailErr) {
              console.error("Failed to send overdue email:", mailErr);
            }
          }
        }
      }

      if (quotationModified) {
        await quotation.save();
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    return results;
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------------------------------------
// DELETE QUOTATION
// -------------------------------------------------------------
export const deleteQuotation = async (id: string) => {
  try {
    await connectToDatabase();
    const deleted = await Quotation.findByIdAndDelete(id);
    if (!deleted) throw new Error("Quotation not found");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quotations");
    return { success: true };
  } catch (error) {
    handleError(error);
  }
};

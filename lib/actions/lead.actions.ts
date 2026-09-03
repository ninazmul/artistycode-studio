"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Lead from "../database/models/lead.model";
import { CreateLeadParams } from "@/types";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";

export const createLead = async (leadData: CreateLeadParams) => {
  try {
    await connectToDatabase();

    // Check if duplicate
    const existing = await Lead.findOne({ email: leadData.email });
    if (existing) {
      throw new Error(`Lead with email ${leadData.email} already exists`);
    }

    const newLead = await Lead.create(leadData);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return JSON.parse(JSON.stringify(newLead));
  } catch (error) {
    handleError(error);
  }
};

export const getAllLeads = async () => {
  try {
    await connectToDatabase();
    const leads = await Lead.find().sort({ _id: -1 }).lean();
    return JSON.parse(JSON.stringify(leads));
  } catch (error) {
    handleError(error);
  }
};

export const updateLead = async (
  leadId: string,
  leadData: Partial<CreateLeadParams>,
) => {
  try {
    await connectToDatabase();
    const updated = await Lead.findByIdAndUpdate(
      leadId,
      { ...leadData },
      { new: true, runValidators: true },
    );
    if (!updated) throw new Error("Lead not found");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
};

export const deleteLead = async (leadId: string) => {
  try {
    await connectToDatabase();
    const deleted = await Lead.findByIdAndDelete(leadId);
    if (!deleted) throw new Error("Lead not found");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    handleError(error);
  }
};

export const importLeadsAction = async (leads: CreateLeadParams[]) => {
  try {
    await connectToDatabase();

    const operations = leads.map((lead) => ({
      updateOne: {
        filter: { email: lead.email },
        update: { $set: lead },
        upsert: true,
      },
    }));

    const result = await Lead.bulkWrite(operations);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return {
      success: true,
      insertedCount: result.upsertedCount || 0,
      modifiedCount: result.modifiedCount || 0,
    };
  } catch (error) {
    handleError(error);
  }
};

export const sendColdEmailsAction = async ({
  leadIds,
  subject,
  bodyTemplate,
}: {
  leadIds: string[];
  subject: string;
  bodyTemplate: string;
}) => {
  try {
    await connectToDatabase();

    const leads = await Lead.find({ _id: { $in: leadIds } });
    if (!leads.length) {
      throw new Error("No leads found for the provided IDs");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const results = {
      successCount: 0,
      failureCount: 0,
      details: [] as { email: string; success: boolean; error?: string }[],
    };

    // Track successful IDs for a single batch update — avoids N+1 save() calls
    const successfulIds: string[] = [];

    // Send emails concurrently (capped to avoid SMTP limits)
    await Promise.all(
      leads.map(async (lead) => {
        // Personalize subject & body via template tags: {{name}} and {{company}}
        const personalizedSubject = subject
          .replace(/\{\{name\}\}/gi, lead.name)
          .replace(/\{\{company\}\}/gi, lead.company || "");

        const personalizedBody = bodyTemplate
          .replace(/\{\{name\}\}/gi, lead.name)
          .replace(/\{\{company\}\}/gi, lead.company || "");

        try {
          await transporter.sendMail({
            from: `"ArtistyCode Studio" <${process.env.EMAIL_USER}>`,
            to: lead.email,
            subject: personalizedSubject,
            html: personalizedBody,
          });
          // Collect successful IDs for batch DB update
          successfulIds.push(lead._id.toString());
          results.successCount++;
          results.details.push({ email: lead.email, success: true });
        } catch (err: any) {
          results.failureCount++;
          results.details.push({
            email: lead.email,
            success: false,
            error: err.message || "Failed to send email",
          });
        }
      }),
    );

    // Single batch update instead of N individual save() calls — O(1) DB round-trips
    if (successfulIds.length > 0) {
      await Lead.updateMany(
        { _id: { $in: successfulIds } },
        { $set: { status: "Emailed" } },
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return results;
  } catch (error) {
    handleError(error);
  }
};

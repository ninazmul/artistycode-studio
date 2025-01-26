"use server";

import { CreateAdminParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Admin from "../database/models/admin.model";

export const createAdmin = async ({ Name, Email }: CreateAdminParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Admin.create({ name: Name, email: Email });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllAdmins = async () => {
  try {
    await connectToDatabase();

    const admins = await Admin.find();

    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    handleError(error);
  }
};

export const deleteAdmin = async (adminId: string) => {
  try {
    await connectToDatabase();

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      throw new Error("Admin not found");
    }

    return { message: "Admin deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export async function isAdmin(email: string): Promise<boolean> {
  if (!email) {
    return false;
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log(`No admin found for email: ${email}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}




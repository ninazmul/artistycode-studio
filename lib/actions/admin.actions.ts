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
    const admins = await Admin.find().lean();
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
  if (!email) return false;

  try {
    await connectToDatabase();
    // .select("_id").lean() avoids full document instantiation — O(1) auth check
    const admin = await Admin.findOne({ email }).select("_id").lean();
    return !!admin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}




"use server";

import { CreateModeratorParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Moderator from "../database/models/moderator.model";
import { revalidatePath } from "next/cache";

export const createModerator = async ({
  Name,
  Email,
}: CreateModeratorParams) => {
  try {
    await connectToDatabase();

    const newModerator = await Moderator.create({ name: Name, email: Email });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/moderators");

    return JSON.parse(JSON.stringify(newModerator));
  } catch (error) {
    handleError(error);
  }
};

export const getAllModerators = async () => {
  try {
    await connectToDatabase();
    const moderators = await Moderator.find().lean();
    return JSON.parse(JSON.stringify(moderators));
  } catch (error) {
    handleError(error);
  }
};

export const deleteModerator = async (moderatorId: string) => {
  try {
    await connectToDatabase();

    const deletedModerator = await Moderator.findByIdAndDelete(moderatorId);

    if (!deletedModerator) {
      throw new Error("Moderator not found");
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/moderators");

    return { message: "Moderator deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export async function isModerator(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    await connectToDatabase();
    // .select("_id").lean() avoids full document instantiation — O(1) auth check
    const moderator = await Moderator.findOne({ email }).select("_id").lean();
    return !!moderator;
  } catch (error) {
    console.error("Error checking moderator status:", error);
    return false;
  }
}

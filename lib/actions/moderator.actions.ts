"use server";

import { CreateModeratorParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Moderator from "../database/models/moderator.model";

export const createModerator = async ({ Name, Email }: CreateModeratorParams) => {
  try {
    await connectToDatabase();

    const newModerator = await Moderator.create({ name: Name, email: Email });

    return JSON.parse(JSON.stringify(newModerator));
  } catch (error) {
    handleError(error);
  }
};

export const getAllModerators = async () => {
  try {
    await connectToDatabase();

    const moderators = await Moderator.find();

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

    return { message: "Moderator deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export async function isModerator(email: string): Promise<boolean> {
  if (!email) {
    return false;
  }

  try {
    await connectToDatabase();

    const moderator = await Moderator.findOne({ email });

    if (!moderator) {
      console.log(`No moderator found for email: ${email}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking moderator status:", error);
    return false;
  }
}




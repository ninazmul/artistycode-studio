"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { handleError } from "@/lib/utils";

import { CreateUserParams, UpdateUserParams } from "@/types";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// Get a user by their clerkId (with role included)
export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId }).select("role");

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Direct retrieval of signed-in user's email from Clerk
 * No webhook or MongoDB User sync required.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    const email =
      clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      null;
    return email;
  } catch (error) {
    console.error("Error fetching current user email from Clerk:", error);
    return null;
  }
}

/**
 * Direct retrieval of signed-in Clerk user details
 */
export async function getCurrentClerkUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    const email =
      clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      "";
    return {
      userId: clerkUser.id,
      email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || email,
      imageUrl: clerkUser.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching current Clerk user:", error);
    return null;
  }
}

export async function getUserEmailById(userId?: string): Promise<string | null> {
  try {
    // 1. Direct from signed-in Clerk session
    const directEmail = await getCurrentUserEmail();
    if (directEmail) return directEmail;

    // 2. Fallback to MongoDB if a MongoDB document ID or clerkId was passed
    if (userId) {
      await connectToDatabase();
      // Search by clerkId first (since Clerk userId starts with "user_")
      let user: any = await User.findOne({ clerkId: userId }).select("email").lean();

      // Fallback: If not found and valid ObjectId, search by _id
      if (!user && /^[0-9a-fA-F]{24}$/.test(userId)) {
        user = await User.findById(userId).select("email").lean();
      }
      if (user?.email) return user.email;
    }

    return null;
  } catch (error) {
    console.error("Error in getUserEmailById:", error);
    return null;
  }
}

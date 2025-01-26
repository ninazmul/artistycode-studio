"use server";

import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Registration from "../database/models/registration.model";
import { RegistrationParams } from "@/types";

// ====== CREATE REGISTRATION
export const createRegistration = async (params: RegistrationParams) => {
  try {
    await connectToDatabase();

    const newRegistration = await Registration.create(params);

    return JSON.parse(JSON.stringify(newRegistration));
  } catch (error) {
    handleError(error);
  }
};

// ====== GET ALL REGISTRATIONS
export const getAllRegistrations = async () => {
  try {
    await connectToDatabase();

    const registrations = await Registration.find();

    return JSON.parse(JSON.stringify(registrations));
  } catch (error) {
    handleError(error);
  }
};

// ====== GET REGISTRATION BY ID
export const getRegistrationById = async (registrationId: string) => {
  try {
    await connectToDatabase();

    const registration = await Registration.findById(registrationId);

    if (!registration) {
      throw new Error("Registration not found");
    }

    return JSON.parse(JSON.stringify(registration));
  } catch (error) {
    handleError(error);
  }
};

// ====== GET REGISTRATIONS BY USER ID
export const getRegistrationsByUserId = async (userId: string) => {
  try {
    await connectToDatabase();

    const registrations = await Registration.find({ userId });

    if (!registrations || registrations.length === 0) {
      return null;
    }

    return JSON.parse(JSON.stringify(registrations));
  } catch (error) {
    handleError(error);
  }
};

// ====== UPDATE REGISTRATION
export const updateRegistration = async (
  registrationId: string,
  updateData: Partial<RegistrationParams>
) => {
  try {
    await connectToDatabase();

    const updatedRegistration = await Registration.findByIdAndUpdate(
      registrationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      throw new Error("Registration not found");
    }

    return JSON.parse(JSON.stringify(updatedRegistration));
  } catch (error) {
    handleError(error);
  }
};

// ====== DELETE REGISTRATION
export const deleteRegistration = async (registrationId: string) => {
  try {
    await connectToDatabase();

    const deletedRegistration = await Registration.findByIdAndDelete(
      registrationId
    );

    if (!deletedRegistration) {
      throw new Error("Registration not found");
    }

    return { message: "Registration deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

// ====== CHECK REGISTRATION EXISTENCE BY CLERK USER ID
export const isRegistered = async (clerkUserId: string): Promise<boolean> => {
  if (!clerkUserId) {
    return false;
  }

  try {
    await connectToDatabase();

    // Check if a registration exists with a status other than "pending"
    const registration = await Registration.findOne({
      userId: clerkUserId,
      status: { $ne: "pending" }, // Exclude "pending" status
    });

    if (!registration) {
      console.log(`No non-pending registration found for Clerk user ID: ${clerkUserId}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking registration status:", error);
    handleError(error);
    return false;
  }
};

// ====== CHECK SUBMIT REGISTRATION EXISTENCE BY CLERK USER ID
export const isSubmitted = async (clerkUserId: string): Promise<boolean> => {
  if (!clerkUserId) {
    return false;
  }

  try {
    await connectToDatabase();

    const submitRegistration = await Registration.findOne({ userId: clerkUserId });

    if (!submitRegistration) {
      console.log(`No registration found for Clerk user ID: ${clerkUserId}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking registration status:", error);
    handleError(error);
    return false;
  }
};

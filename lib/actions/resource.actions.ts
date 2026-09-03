"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Resource from "../database/models/resource.model";
import { CreateResourceParams } from "@/types";
import { revalidatePath } from "next/cache";

// Projection for public listing
const RESOURCE_LIST_PROJECTION =
  "title description stack image url file price isFree category author";

export const createResource = async ({
  title,
  description,
  stack,
  image,
  url,
  file,
  price,
  isFree,
  category,
  author,
}: CreateResourceParams) => {
  try {
    await connectToDatabase();
    const newResource = await Resource.create({
      title,
      description,
      stack,
      image,
      url,
      file,
      price,
      isFree,
      category,
      author,
    });

    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/resources");

    return JSON.parse(JSON.stringify(newResource));
  } catch (error) {
    handleError(error);
  }
};

export const getAllResources = async () => {
  try {
    await connectToDatabase();
    const resources = await Resource.find()
      .select(RESOURCE_LIST_PROJECTION)
      .sort({ _id: -1 })
      .lean();
    return JSON.parse(JSON.stringify(resources));
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

export const getResourceById = async (resourceId: string) => {
  try {
    await connectToDatabase();
    const resource = await Resource.findById(resourceId).lean();
    if (!resource) throw new Error("Resource not found");
    return JSON.parse(JSON.stringify(resource));
  } catch (error) {
    handleError(error);
  }
};

export const deleteResource = async (resourceId: string) => {
  try {
    await connectToDatabase();
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
    if (!deletedResource) throw new Error("Resource not found");

    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath(`/resources/${resourceId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/resources");

    return { message: "Resource deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const updateResource = async (
  resourceId: string,
  updateData: Partial<CreateResourceParams>,
) => {
  try {
    await connectToDatabase();
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { ...updateData },
      { new: true, runValidators: true },
    );
    if (!updatedResource) throw new Error("Resource not found");

    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath(`/resources/${resourceId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/resources");

    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    handleError(error);
  }
};

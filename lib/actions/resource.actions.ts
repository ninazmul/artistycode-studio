"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Resource from "../database/models/resource.model";
import { CreateResourceParams } from "@/types";

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
  author
}: CreateResourceParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Resource.create({
      title,
      description,
      stack,
      image,
      url,
      file,
      price,
      isFree,
      category,
      author
    });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllResources = async () => {
  try {
    await connectToDatabase();

    const resources = await Resource.find().sort({ _id: -1 });

    return JSON.parse(JSON.stringify(resources));
  } catch (error) {
    handleError(error);
  }
};

export const getResourceById = async (resourceId: string) => {
  try {
    await connectToDatabase();

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      throw new Error("Resource not found");
    }

    return JSON.parse(JSON.stringify(resource));
  } catch (error) {
    handleError(error);
  }
};

export const deleteResource = async (resourceId: string) => {
  try {
    await connectToDatabase();

    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      throw new Error("Resource not found");
    }

    return { message: "Resource deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const updateResource = async (
  resourceId: string,
  updateData: Partial<CreateResourceParams>
) => {
  try {
    await connectToDatabase();

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      throw new Error("Resource not found");
    }

    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    handleError(error);
  }
};

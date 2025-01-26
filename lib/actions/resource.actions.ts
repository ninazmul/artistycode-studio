"use server";

import { ResourceParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Resource from "../database/models/resource.model";

export const addResource = async ({
  Heading,
  Image,
  Link,
  Category,
}: ResourceParams) => {
  try {
    await connectToDatabase();

    const newResource = await Resource.create({
      heading: Heading,
      image: Image,
      link: Link,
      category: Category,
    });

    return JSON.parse(JSON.stringify(newResource));
  } catch (error) {
    handleError(error);
  }
};

export const getAllResource = async () => {
  try {
    await connectToDatabase();

    const resource = await Resource.find();

    return JSON.parse(JSON.stringify(resource));
  } catch (error) {
    handleError(error);
  }
};

// ====== UPDATE RESOURCE
export const updateResource = async (
  resourceId: string,
  updateData: Partial<ResourceParams>
) => {
  try {
    await connectToDatabase();

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      updateData,
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

// ====== GET CATEGORIES
export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Resource.distinct("category");

    return JSON.parse(JSON.stringify(categories));
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

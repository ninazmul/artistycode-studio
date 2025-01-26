"use server";

import { AddBannerParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Banner from "../database/models/banner.model";

export const addBanner = async ({ Title, Image }: AddBannerParams) => {
  try {
    await connectToDatabase();

    const newBanner = await Banner.create({ title: Title, image: Image });

    return JSON.parse(JSON.stringify(newBanner));
  } catch (error) {
    handleError(error);
  }
};

export const getAllBanner = async () => {
  try {
    await connectToDatabase();

    const banner = await Banner.find();

    return JSON.parse(JSON.stringify(banner));
  } catch (error) {
    handleError(error);
  }
};

export const deleteBanner = async (bannerId: string) => {
  try {
    await connectToDatabase();

    const deletedBanner = await Banner.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      throw new Error("Banner not found");
    }

    return { message: "Banner deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Review from "../database/models/review.model";
import { CreateReviewParams } from "@/types";

export const createReview = async ({
  name,
  title,
  quote,
  image,
  verified,
}: CreateReviewParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Review.create({
      name,
      title,
      quote,
      image,
      verified,
    });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllReviews = async () => {
  try {
    await connectToDatabase();

    const reviews = await Review.find().sort({ _id: -1 });

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
};

export const getReviewById = async (reviewId: string) => {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    handleError(error);
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await connectToDatabase();

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      throw new Error("Review not found");
    }

    return { message: "Review deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const updateReview = async (
  reviewId: string,
  updateData: Partial<CreateReviewParams>
) => {
  try {
    await connectToDatabase();

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      throw new Error("Review not found");
    }

    return JSON.parse(JSON.stringify(updatedReview));
  } catch (error) {
    handleError(error);
  }
};

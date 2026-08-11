"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Review from "../database/models/review.model";
import { CreateReviewParams } from "@/types";
import { revalidatePath } from "next/cache";

const REVIEW_PROJECTION = "name title quote image verified";

export const createReview = async ({
  name,
  title,
  quote,
  image,
  verified,
}: CreateReviewParams) => {
  try {
    await connectToDatabase();
    const newReview = await Review.create({ name, title, quote, image, verified });

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/dashboard/reviews");

    return JSON.parse(JSON.stringify(newReview));
  } catch (error) {
    handleError(error);
  }
};

export const getAllReviews = async () => {
  try {
    await connectToDatabase();
    const reviews = await Review.find()
      .select(REVIEW_PROJECTION)
      .sort({ _id: -1 })
      .lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
};

/**
 * Optimized: filters verified:true at the DB level using the index — 
 * no JS-side filtering needed in the page component
 */
export const getVerifiedReviews = async () => {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ verified: true })
      .select(REVIEW_PROJECTION)
      .sort({ _id: -1 })
      .lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const getReviewById = async (reviewId: string) => {
  try {
    await connectToDatabase();
    const review = await Review.findById(reviewId).lean();
    if (!review) throw new Error("Review not found");
    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    handleError(error);
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await connectToDatabase();
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) throw new Error("Review not found");

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/dashboard/reviews");

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
    if (!updatedReview) throw new Error("Review not found");

    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/dashboard/reviews");

    return JSON.parse(JSON.stringify(updatedReview));
  } catch (error) {
    handleError(error);
  }
};

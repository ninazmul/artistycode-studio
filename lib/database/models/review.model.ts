import { Document, Schema, Types, model, models } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  name: string;
  title: string;
  quote: string;
  image: string;
  verified: boolean;
}

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  quote: { type: String, required: true },
  image: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const Review = models.Review || model("Review", ReviewSchema);

export default Review;

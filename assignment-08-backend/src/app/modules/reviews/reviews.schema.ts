import { model, Schema, Types } from "mongoose";
import { IReview } from "./reviews.interface";

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Types.ObjectId, required: true, ref: "Users" },
    hostId: { type: Types.ObjectId, required: true, ref: "Users" },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
  },
);

export const Reviews = model<IReview>("Reviews", reviewSchema);

import { ObjectId } from "mongoose";

export interface IReview {
  userId: ObjectId;
  hostId: ObjectId;
  review: string;
  rating: number;
}

export interface IReviewFilters {
  searchTerm?: string;
  userId?: string;
  hostId?: string;
  rating?: number;
}

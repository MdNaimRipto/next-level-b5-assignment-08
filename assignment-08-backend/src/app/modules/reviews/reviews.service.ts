import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IReview, IReviewFilters } from "./reviews.interface";
import { Reviews } from "./reviews.schema";
import { IPaginationOptions } from "../../../interface/pagination";
import { ReviewSearchableFields } from "./reviews.constant";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { IUserWithoutPassword } from "../users/users.interface";

// Create Review
const createReview = async (payload: IReview): Promise<IReview> => {
  const review = await Reviews.create(payload);

  if (!review) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create review");
  }

  return review;
};

// Get All Reviews
const getAllReviews = async (
  filters: IReviewFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: ReviewSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Reviews.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reviews.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Reviews by Host
const getReviewsByHost = async (
  hostId: string,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Reviews.find({ hostId })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "userId",
        select: "userName profileImage",
      },
    ]);

  const total = await Reviews.countDocuments({ hostId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewsByHost,
};

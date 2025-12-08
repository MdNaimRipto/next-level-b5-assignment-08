import { SortOrder } from "mongoose";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../interface/pagination";
import { OrderSearchableFields } from "./order.constant";
import { IOrder, IOrderFilters } from "./order.interface";
import { Orders } from "./order.schema";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  accessToken: string,
): Promise<IGenericPaginationResponse<IOrder[]>> => {
  // verify token
  jwtHelpers.jwtVerify(accessToken, config.jwt_access_secret);

  const { searchTerm, ...filterData } = filters;
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: OrderSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  const result = await Orders.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Orders.countDocuments(whereConditions);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getUserOrders = async (accessToken: string) => {
  const { id } = jwtHelpers.jwtVerify(
    accessToken,
    config.jwt_access_secret,
  ) as any;
  const result = await Orders.find({ userId: id }).populate([
    {
      path: "eventId",
    },
  ]);
  return result;
};

const updateOrder = async (id: string, payload: Partial<IOrder>) => {
  const result = await Orders.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getOrdersOverview = async () => {
  const totalOrders = await Orders.countDocuments();
  const totalAmount = await Orders.aggregate([
    { $group: { _id: null, total: { $sum: "$paidAmount" } } },
  ]);

  return {
    totalOrders,
    totalAmount: totalAmount[0]?.total || 0,
  };
};

export const OrderService = {
  getAllOrders,
  getUserOrders,
  updateOrder,
  getOrdersOverview,
};

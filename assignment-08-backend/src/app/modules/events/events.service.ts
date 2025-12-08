import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IEvent, IEventFilters } from "./events.interface";
import { Events } from "./events.schema";
import { IPaginationOptions } from "../../../interface/pagination";
import { EventSearchableFields } from "./events.constant";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";
import { roleCheck } from "../../../util/roleCheck";
import { ImageService } from "../images/images.service";

// Create Event
const createEvent = async (payload: IEvent, token: string): Promise<null> => {
  const { id, email } = jwtHelpers.jwtVerify(token, config.jwt_access_secret);
  const isAdminOrHost = await roleCheck(email, String(id), ["ADMIN", "HOST"]);
  if (!isAdminOrHost) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This account has no access to upload event!",
    );
  }
  const event = await Events.create({ ...payload, hostId: id });

  if (!event) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create event");
  }

  return null;
};

// Get All Events
const getAllEvents = async (
  filters: IEventFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: EventSearchableFields.map(field => ({
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

  const result = await Events.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Events.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Single Event
const getEventDetails = async (id: string): Promise<IEvent | null> => {
  const event = await Events.findById(id).populate([
    {
      path: "hostId",
      select: "userName email createdAt profileImage",
    },
  ]);

  return event;
};

// Update Event
const updateEvent = async (
  id: string,
  payload: Partial<IEvent>,
  token: string,
): Promise<null> => {
  const { id: uid, email } = jwtHelpers.jwtVerify(
    token,
    config.jwt_access_secret,
  );
  const isAdminOrHost = await roleCheck(email, String(uid), ["ADMIN", "HOST"]);
  if (!isAdminOrHost) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This account has no access to upload event!",
    );
  }
  const event = await Events.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  return null;
};

// Delete Event
export const deleteEvent = async (id: string, token: string): Promise<null> => {
  const { id: uid, email } = jwtHelpers.jwtVerify(
    token,
    config.jwt_access_secret,
  );
  const isAdminOrHost = await roleCheck(email, String(id), ["ADMIN", "HOST"]);
  if (!isAdminOrHost) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This account has no access to upload event!",
    );
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if event exists
    const event = await Events.findById(id).session(session);

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    // 2. Delete the image from Cloudinary (outside of DB but logically part of transaction)
    if (event.banner) {
      await ImageService.deleteImage({
        publicId: event.banner, // better to send URL and let service extract publicId
      });
    }

    // 3. Delete the event
    await Events.findByIdAndDelete(id).session(session);

    // 4. Commit transaction
    await session.commitTransaction();
    session.endSession();
    return null;
  } catch (error) {
    // If anything fails, rollback DB changes (Cloudinary cannot be rolled back)
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get Events by Host
const getEventsByHost = async (
  paginationOptions: IPaginationOptions,
  hostId: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Events.find({ hostId })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Events.countDocuments({ hostId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  getEventsByHost,
};

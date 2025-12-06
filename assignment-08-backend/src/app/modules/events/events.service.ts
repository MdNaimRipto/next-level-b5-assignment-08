import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IEvent, IEventFilters } from "./events.interface";
import { Events } from "./events.schema";
import { IPaginationOptions } from "../../../interface/pagination";
import { EventSearchableFields } from "./events.constant";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";

// Create Event
const createEvent = async (payload: IEvent): Promise<null> => {
  const event = await Events.create(payload);

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
  const event = await Events.findById(id);

  return event;
};

// Update Event
const updateEvent = async (
  id: string,
  payload: Partial<IEvent>,
): Promise<null> => {
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
const deleteEvent = async (id: string): Promise<null> => {
  const event = await Events.findByIdAndDelete(id);

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  return null;
};

// Get Events by Host
const getEventsByHost = async (
  hostId: string,
  paginationOptions: IPaginationOptions,
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

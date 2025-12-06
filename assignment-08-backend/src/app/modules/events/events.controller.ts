import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { EventService } from "./events.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/shared";
import { EventFilterableFields } from "./events.constant";
import { paginationFields } from "../../../constants/pagination.constant";

// Create Event
const createEvent = catchAsync(async (req: Request, res: Response) => {
  const { ...eventInfo } = req.body;

  const result = await EventService.createEvent(eventInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event Created Successfully",
    data: result,
  });
});

// Get All Events
const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, EventFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventService.getAllEvents(filters, paginationOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Events Retrieved Successfully",
    data: result,
  });
});

// Get Single Event
const getEventDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventService.getEventDetails(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event Retrieved Successfully",
    data: result,
  });
});

// Update Event
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;

  const result = await EventService.updateEvent(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event Updated Successfully",
    data: result,
  });
});

// Delete Event
const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventService.deleteEvent(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event Deleted Successfully",
    data: result,
  });
});

// Get Events by Host
const getEventsByHost = catchAsync(async (req: Request, res: Response) => {
  const { hostId } = req.params;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventService.getEventsByHost(hostId, paginationOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Host Events Retrieved Successfully",
    data: result,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  getEventsByHost,
};

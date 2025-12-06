"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const events_schema_1 = require("./events.schema");
const events_constant_1 = require("./events.constant");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
// Create Event
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_schema_1.Events.create(payload);
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create event");
    }
    return null;
});
// Get All Events
const getAllEvents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: events_constant_1.EventSearchableFields.map(field => ({
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
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield events_schema_1.Events.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield events_schema_1.Events.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Get Single Event
const getEventDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_schema_1.Events.findById(id);
    return event;
});
// Update Event
const updateEvent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_schema_1.Events.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    return null;
});
// Delete Event
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_schema_1.Events.findByIdAndDelete(id);
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    return null;
});
// Get Events by Host
const getEventsByHost = (hostId, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield events_schema_1.Events.find({ hostId })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield events_schema_1.Events.countDocuments({ hostId });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.EventService = {
    createEvent,
    getAllEvents,
    getEventDetails,
    updateEvent,
    deleteEvent,
    getEventsByHost,
};

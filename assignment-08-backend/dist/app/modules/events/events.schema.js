"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = require("mongoose");
const events_constant_1 = require("./events.constant");
const eventSchema = new mongoose_1.Schema({
    hostId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Users" },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    category: {
        type: String,
        enum: events_constant_1.EventCategoryEnums,
        required: true,
    },
    status: {
        type: String,
        enum: events_constant_1.EventStatusEnums,
        required: true,
        default: "UPCOMING",
    },
    entryFee: { type: Number, required: true, default: 0, min: 0 },
    totalParticipants: { type: Number, required: true, default: 0, min: 0 },
    detailedInformations: [{ type: String, required: true, default: [] }],
    location: { type: String, required: true },
    banner: { type: String, required: true },
    minParticipants: { type: Number, required: true, default: 0, min: 0 },
    maxParticipants: { type: Number, required: true, default: 0, min: 0 },
}, {
    timestamps: true,
});
exports.Events = (0, mongoose_1.model)("Events", eventSchema);

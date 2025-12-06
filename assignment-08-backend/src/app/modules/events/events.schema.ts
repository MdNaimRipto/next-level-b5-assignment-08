import { model, Schema } from "mongoose";
import { IEvent } from "./events.interface";
import { EventStatusEnums, EventCategoryEnums } from "./events.constant";

const eventSchema = new Schema<IEvent>(
  {
    hostId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    category: {
      type: String,
      enum: EventCategoryEnums,
      required: true,
    },
    status: {
      type: String,
      enum: EventStatusEnums,
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
  },
  {
    timestamps: true,
  },
);

export const Events = model<IEvent>("Events", eventSchema);

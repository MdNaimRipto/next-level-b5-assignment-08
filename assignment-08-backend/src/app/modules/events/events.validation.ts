import { z } from "zod";
import { EventCategoryEnums } from "./events.constant";

const createEventZodSchema = z.object({
  body: z.object({
    eventName: z.string({
      required_error: "Event Name is Required",
    }),
    description: z.string({
      required_error: "Description is Required",
    }),
    eventDate: z.string({
      required_error: "Event Date is Required",
    }),
    category: z.enum(EventCategoryEnums as unknown as [string, ...string[]], {
      required_error: "Category is Required",
    }),
    entryFee: z.number().optional(),
    totalParticipants: z.number().optional(),
    detailedInformations: z.array(z.string()).optional(),
    location: z.string({
      required_error: "Location is Required",
    }),
    banner: z.string({
      required_error: "Banner is Required",
    }),
    minParticipants: z.number().optional(),
    maxParticipants: z.number().optional(),
  }),
});

const updateEventZodSchema = z.object({
  body: z.object({
    eventName: z.string().optional(),
    description: z.string().optional(),
    eventDate: z.string().optional(),
    category: z
      .enum(EventCategoryEnums as unknown as [string, ...string[]])
      .optional(),
    status: z.string().optional(),
    entryFee: z.number().optional(),
    totalParticipants: z.number().optional(),
    detailedInformations: z.array(z.string()).optional(),
    location: z.string().optional(),
    banner: z.string().optional(),
    minParticipants: z.number().optional(),
    maxParticipants: z.number().optional(),
  }),
});

export const EventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};

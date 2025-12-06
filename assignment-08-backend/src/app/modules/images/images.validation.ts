import { z } from "zod";

const uploadImageZodSchema = z.object({
  body: z.object({
    filePath: z.string({
      required_error: "File path is Required",
    }),
  }),
});

const deleteImageZodSchema = z.object({
  body: z.object({
    publicId: z.string({
      required_error: "Public ID is Required",
    }),
  }),
});

export const ImageValidation = {
  uploadImageZodSchema,
  deleteImageZodSchema,
};

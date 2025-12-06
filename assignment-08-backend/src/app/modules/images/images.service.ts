import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IImageUploadResponse } from "./images.interface";
import cloudinary from "./cloudinary.config";

// Upload Image
const uploadImage = async (filePath: string): Promise<IImageUploadResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "eventide-momento",
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to upload image");
  }
};

// Delete Image
const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete image");
  }
};

export const ImageService = {
  uploadImage,
  deleteImage,
};

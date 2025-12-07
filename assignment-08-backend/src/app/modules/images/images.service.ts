import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IImageUploadResponse } from "./images.interface";
import cloudinary from "./cloudinary.config";
import path from "path";
import fs from "fs/promises";
import { extractPublicId } from "cloudinary-build-url";

// Upload Image
const uploadImage = async (filePath: string): Promise<IImageUploadResponse> => {
  const absolutePath = path.resolve(filePath);

  try {
    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: "eventide-momento",
      resource_type: "auto",
    });

    // After successful upload → clean temp file
    await fs.unlink(absolutePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Even on failure, try to clean up
    try {
      await fs.unlink(absolutePath);
    } catch (_) {}

    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to upload image");
  }
};

// Delete Image
const deleteImage = async (url: { publicId: string }): Promise<null> => {
  // const result = await cloudinary.uploader.destroy(`${publicId}`);
  const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
  console.log(url);

  const match = url.publicId.toString().match(regex);

  console.log({ match });

  if (match && match[1]) {
    const public_id = match[1];
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(`File ${public_id} is deleted from cloudinary`);
    if (result.result === "not found") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete image");
    }
  }
  return null;
};

export const ImageService = {
  uploadImage,
  deleteImage,
};

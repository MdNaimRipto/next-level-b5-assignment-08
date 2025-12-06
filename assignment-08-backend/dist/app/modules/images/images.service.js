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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
// Upload Image
const uploadImage = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_config_1.default.uploader.upload(filePath, {
            folder: "eventide-momento",
            resource_type: "auto",
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to upload image");
    }
});
// Delete Image
const deleteImage = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary_config_1.default.uploader.destroy(publicId);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete image");
    }
});
exports.ImageService = {
    uploadImage,
    deleteImage,
};

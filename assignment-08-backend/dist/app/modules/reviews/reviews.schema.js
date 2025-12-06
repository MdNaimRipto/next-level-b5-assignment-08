"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: "Users" },
    hostId: { type: mongoose_1.Types.ObjectId, required: true, ref: "Users" },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, {
    timestamps: true,
});
exports.Reviews = (0, mongoose_1.model)("Reviews", reviewSchema);

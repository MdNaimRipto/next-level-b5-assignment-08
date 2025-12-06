"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Events", required: true },
    paidAmount: { type: Number, required: true, min: 0 },
    transectionId: { type: String, required: true, unique: true },
    paymentDate: { type: String, required: false },
}, {
    timestamps: true,
});
exports.Orders = (0, mongoose_1.model)("Orders", orderSchema);

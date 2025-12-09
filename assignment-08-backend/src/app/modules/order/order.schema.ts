import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    hostId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Events", required: true },
    paidAmount: { type: Number, required: true, min: 0 },
    transectionId: { type: String, required: true, unique: true },
    paymentDate: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export const Orders = model<IOrder>("Orders", orderSchema);

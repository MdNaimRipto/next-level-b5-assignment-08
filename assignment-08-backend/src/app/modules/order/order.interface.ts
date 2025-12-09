import { ObjectId } from "mongoose";

export interface IOrder {
  userId: ObjectId;
  eventId: ObjectId;
  hostId: ObjectId;
  paidAmount: number;
  transectionId: string;
  paymentDate?: string;
}

export type IOrderFilters = {
  searchTerm?: string;
  userId?: string;
  eventId?: string;
  transectionId?: string;
};

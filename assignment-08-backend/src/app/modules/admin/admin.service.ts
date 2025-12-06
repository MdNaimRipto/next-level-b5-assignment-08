import { Orders } from "../order/order.schema";
import { Users } from "../users/users.schema";
import { IAdminOverview } from "./admin.interface";

const getAdminOverview = async (): Promise<IAdminOverview> => {
  const totalSale = await Orders.countDocuments();

  const amountCounter = await Orders.aggregate([
    {
      $group: {
        _id: null,
        totalAmountPaid: { $sum: { $toDouble: "$amount" } }, // Convert string to number
      },
    },
  ]);

  const totalAmountPaid =
    amountCounter.length > 0 ? amountCounter[0].totalAmountPaid : 0;

  const totalCustomer = await Users.countDocuments();

  return {
    totalSale,
    totalAmountPaid,
    totalCustomer,
  };
};

export const AdminService = {
  getAdminOverview,
};

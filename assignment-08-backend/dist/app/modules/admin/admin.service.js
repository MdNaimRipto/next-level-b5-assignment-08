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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const order_schema_1 = require("../order/order.schema");
const users_schema_1 = require("../users/users.schema");
const getAdminOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalSale = yield order_schema_1.Orders.countDocuments();
    const amountCounter = yield order_schema_1.Orders.aggregate([
        {
            $group: {
                _id: null,
                totalAmountPaid: { $sum: { $toDouble: "$amount" } }, // Convert string to number
            },
        },
    ]);
    const totalAmountPaid = amountCounter.length > 0 ? amountCounter[0].totalAmountPaid : 0;
    const totalCustomer = yield users_schema_1.Users.countDocuments();
    return {
        totalSale,
        totalAmountPaid,
        totalCustomer,
    };
});
exports.AdminService = {
    getAdminOverview,
};

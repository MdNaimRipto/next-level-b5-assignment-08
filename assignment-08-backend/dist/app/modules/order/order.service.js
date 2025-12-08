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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const order_constant_1 = require("./order.constant");
const order_schema_1 = require("./order.schema");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config/config"));
const getAllOrders = (filters, paginationOptions, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    jwtHelpers_1.jwtHelpers.jwtVerify(accessToken, config_1.default.jwt_access_secret);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.OrderSearchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            $and: Object.entries(filterData).map(([key, value]) => ({
                [key]: value,
            })),
        });
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder)
        sortConditions[sortBy] = sortOrder;
    const result = yield order_schema_1.Orders.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield order_schema_1.Orders.countDocuments(whereConditions);
    return {
        meta: { page, limit, total },
        data: result,
    };
});
const getUserOrders = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = jwtHelpers_1.jwtHelpers.jwtVerify(accessToken, config_1.default.jwt_access_secret);
    const result = yield order_schema_1.Orders.find({ userId: id }).populate([
        {
            path: "eventId",
        },
    ]);
    return result;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_schema_1.Orders.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getOrdersOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalOrders = yield order_schema_1.Orders.countDocuments();
    const totalAmount = yield order_schema_1.Orders.aggregate([
        { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);
    return {
        totalOrders,
        totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
    };
});
exports.OrderService = {
    getAllOrders,
    getUserOrders,
    updateOrder,
    getOrdersOverview,
};

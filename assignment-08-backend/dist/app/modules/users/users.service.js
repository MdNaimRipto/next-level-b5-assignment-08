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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const users_schema_1 = require("./users.schema");
const config_1 = __importDefault(require("../../../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_constant_1 = require("./user.constant");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
//* User Register Custom
const userRegister = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, contactNumber } = payload;
    const isExistsUser = yield users_schema_1.Users.findOne({
        $or: [{ email: email.toLowerCase() }, { contactNumber }],
    });
    if (isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Email or Contact Already Exists. Please Check Email And Verify Your Account!");
    }
    const user = yield users_schema_1.Users.create(Object.assign(Object.assign({}, payload), { email: email.toLowerCase() }));
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        // host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.nodemailer_user,
            pass: config_1.default.nodemailer_pass,
        },
    });
    yield transporter.sendMail({
        to: email,
        subject: "Welcome to Eventide Momento!",
        html: `
  <div style="font-family: Arial, sans-serif; color: #3a3a3a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e6e6; border-radius: 8px; background-color: #ffffff;">
    <h2 style="color: #c00a27; text-align: center;">Welcome to Eventide Momento!</h2>

    <p>Hello ${user.userName},</p>

    <p>
      Thank you for joining <strong>Eventide Momento</strong> — your companion for balanced meals and smarter nutrition choices. We’re excited to have you onboard!
    </p>

    <p>
      You can now explore delicious recipes, track your meals, and discover insights that help you maintain a healthier lifestyle.
    </p>

    <div style="text-align: center; margin: 25px 0;">
      <a
        href="https://betterplate.vercel.app"
        style="display: inline-block; padding: 12px 26px; color: #ffffff; background-color: #c00a27; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease;">
        Visit Eventide Momento
      </a>
    </div>

    <p>
      If you didn’t sign up for Eventide Momento, please disregard this email — no action is required.
    </p>

    <p style="margin-top: 30px;">
      Cheers,<br>
      <strong>The Eventide Momento Team</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #e7e6e6; margin: 25px 0;">

    <p style="font-size: 12px; color: #686464; text-align: center;">
      This is an automated message — please do not reply.<br>
      &copy; ${new Date().getFullYear()} Eventide Momento. All rights reserved.
    </p>
  </div>
  `,
    });
    const jwtPayload = {
        email: user.email,
        id: user._id,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
//* User Login Custom
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExists = yield users_schema_1.Users.findOne({ email: email.toLowerCase() });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Email Or Password");
    }
    if (isExists.activeStatus === false) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Please Check Email And Verify Your Account First!");
    }
    if (isExists.accountStatus === "FREEZE") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Your Account Has Been Freezed by Admin. Please Contact With Admin to Make The Account Active Again!");
    }
    const checkPassword = yield bcrypt_1.default.compare(password, isExists.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Email Or Password");
    }
    const jwtPayload = {
        email: isExists.email,
        id: isExists._id,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
// * Get Authenticated User Access
const getAuthenticatedUserDetails = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = jwtHelpers_1.jwtHelpers.jwtVerify(accessToken, config_1.default.jwt_access_secret);
    const result = yield users_schema_1.Users.findOne({
        _id: id,
        email: email.toLowerCase(),
    }).select("-password");
    return !result
        ? null
        : {
            userName: String(result === null || result === void 0 ? void 0 : result.userName),
            email: String(result === null || result === void 0 ? void 0 : result.email),
            contactNumber: String(result === null || result === void 0 ? void 0 : result.contactNumber),
        };
});
// * Logout
const logout = (res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(res.cookie);
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return null;
});
//* Update User
const updateUser = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userID } = jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_access_secret);
    const isExistsUser = yield users_schema_1.Users.findById({ _id: userID });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const { password, role } = payload, updatePayload = __rest(payload, ["password", "role"]);
    if (password !== undefined || role !== undefined) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Permission Denied! Please Try Again.");
    }
    if (payload.email) {
        const isExists = yield users_schema_1.Users.findOne({ email: payload.email });
        if (isExists) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Email Already Exists! Try Another One.");
        }
        updatePayload.email = payload.email;
    }
    if (payload.contactNumber) {
        const isExists = yield users_schema_1.Users.findOne({
            contactNumber: payload.contactNumber,
        });
        if (isExists) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Contact Number Already Exists! Try Another One.");
        }
        updatePayload.contactNumber = payload.contactNumber;
    }
    yield users_schema_1.Users.findOneAndUpdate({ _id: userID }, updatePayload, {
        new: true,
    });
    return null;
});
// * For Updating the password
const updatePassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_access_secret);
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistsUser = yield users_schema_1.Users.findById({ _id: userId });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const isPassMatched = yield bcrypt_1.default.compare(currentPassword, isExistsUser.password);
    if (!isPassMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect current password. Please try again.");
    }
    const isPreviousPass = yield bcrypt_1.default.compare(newPassword, isExistsUser.password);
    if (isPreviousPass || currentPassword === newPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "New Password Cannot be The Previous Password");
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "New Password and Confirm Password must match.");
    }
    const pass = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.salt_round));
    isExistsUser.password = pass;
    yield users_schema_1.Users.findOneAndUpdate({ _id: userId }, isExistsUser, {
        new: true,
    });
    return null;
});
//* Get All Users
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.UserSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    //
    if (Object.keys(filterData).length) {
        andConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => {
                return { [field]: value };
            }),
        });
    }
    //
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield users_schema_1.Users.find(checkAndCondition, {
        password: 0,
        uid: 0,
    })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield users_schema_1.Users.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const deleteUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) {
    const isUserExists = yield users_schema_1.Users.findOne({ _id: id });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Does Not Exists!");
    }
    yield users_schema_1.Users.findOneAndDelete({ _id: id }, { new: true });
    return null;
});
exports.UserService = {
    userRegister,
    userLogin,
    getAuthenticatedUserDetails,
    logout,
    updateUser,
    updatePassword,
    getAllUsers,
    deleteUser,
};

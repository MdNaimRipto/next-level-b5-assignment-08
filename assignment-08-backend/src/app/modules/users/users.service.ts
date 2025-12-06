import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  IAuthenticatedUser,
  ILoginUser,
  IUpdatePassword,
  IUser,
  IUserFilters,
} from "./users.interface";
import { Users } from "./users.schema";
import config from "../../../config/config";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { IPaginationOptions } from "../../../interface/pagination";
import { UserSearchableFields } from "./user.constant";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Response } from "express";

//* User Register Custom
const userRegister = async (payload: IUser): Promise<IAuthenticatedUser> => {
  const { email, contactNumber } = payload;

  const isExistsUser = await Users.findOne({
    $or: [{ email: email.toLowerCase() }, { contactNumber }],
  });

  if (isExistsUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Email or Contact Already Exists. Please Check Email And Verify Your Account!",
    );
  }

  const user = await Users.create({
    ...payload,
    email: email.toLowerCase(),
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: config.nodemailer_user,
      pass: config.nodemailer_pass,
    },
  });

  await transporter.sendMail({
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

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

//* User Login Custom
const userLogin = async (payload: ILoginUser): Promise<IAuthenticatedUser> => {
  const { email, password } = payload;

  const isExists = await Users.findOne({ email: email.toLowerCase() });

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  if (isExists.activeStatus === false) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Please Check Email And Verify Your Account First!",
    );
  }

  if (isExists.accountStatus === "FREEZE") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your Account Has Been Freezed by Admin. Please Contact With Admin to Make The Account Active Again!",
    );
  }

  const checkPassword = await bcrypt.compare(password, isExists.password);

  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const jwtPayload = {
    email: isExists.email,
    id: isExists._id,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// * Get Authenticated User Access
const getAuthenticatedUserDetails = async (
  accessToken: string,
): Promise<Partial<IUser> | null> => {
  const { id, email } = jwtHelpers.jwtVerify(
    accessToken,
    config.jwt_access_secret,
  );

  const result = await Users.findOne({
    _id: id,
    email: email.toLowerCase(),
  }).select("-password");

  return !result
    ? null
    : {
        userName: String(result?.userName),
        email: String(result?.email),
        contactNumber: String(result?.contactNumber),
      };
};

// * Logout
const logout = async (res: Response): Promise<null> => {
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
};

//* Update User
const updateUser = async (
  payload: Partial<IUser>,
  token: string,
): Promise<null> => {
  const { id: userID } = jwtHelpers.jwtVerify(token, config.jwt_access_secret);

  const isExistsUser = await Users.findById({ _id: userID });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const { password, role, ...updatePayload } = payload;

  if (password !== undefined || role !== undefined) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied! Please Try Again.",
    );
  }

  if (payload.email) {
    const isExists = await Users.findOne({ email: payload.email });
    if (isExists) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Email Already Exists! Try Another One.",
      );
    }
    updatePayload.email = payload.email;
  }

  if (payload.contactNumber) {
    const isExists = await Users.findOne({
      contactNumber: payload.contactNumber,
    });
    if (isExists) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Contact Number Already Exists! Try Another One.",
      );
    }
    updatePayload.contactNumber = payload.contactNumber;
  }

  await Users.findOneAndUpdate({ _id: userID }, updatePayload, {
    new: true,
  });

  return null;
};

// * For Updating the password
const updatePassword = async (
  payload: IUpdatePassword,
  token: string,
): Promise<null> => {
  const { id: userId } = jwtHelpers.jwtVerify(token, config.jwt_access_secret);

  const { currentPassword, newPassword, confirmPassword } = payload;

  const isExistsUser = await Users.findById({ _id: userId });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const isPassMatched = await bcrypt.compare(
    currentPassword,
    isExistsUser.password as string,
  );

  if (!isPassMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect current password. Please try again.",
    );
  }

  const isPreviousPass = await bcrypt.compare(
    newPassword,
    isExistsUser.password as string,
  );

  if (isPreviousPass || currentPassword === newPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password Cannot be The Previous Password",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password and Confirm Password must match.",
    );
  }

  const pass = await bcrypt.hash(newPassword, Number(config.salt_round));
  isExistsUser.password = pass;

  await Users.findOneAndUpdate({ _id: userId }, isExistsUser, {
    new: true,
  });

  return null;
};

//* Get All Users
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: UserSearchableFields.map(field => ({
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
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //
  const checkAndCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await Users.find(checkAndCondition, {
    password: 0,
    uid: 0,
  })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Users.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteUser = async ({ id }: { id: string }) => {
  const isUserExists = await Users.findOne({ _id: id });
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exists!");
  }

  await Users.findOneAndDelete({ _id: id }, { new: true });
  return null;
};

export const UserService = {
  userRegister,
  userLogin,
  getAuthenticatedUserDetails,
  logout,
  updateUser,
  updatePassword,
  getAllUsers,
  deleteUser,
};

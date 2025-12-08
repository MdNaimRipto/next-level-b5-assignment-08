import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./users.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { verifyAuthToken } from "../../../util/verifyAuthToken";
import pick from "../../../shared/shared";
import { UserFilterableFields } from "./user.constant";
import { paginationFields } from "../../../constants/pagination.constant";
import { jwtHelpers, setAuthCookie } from "../../../helpers/jwtHelpers";

// User Register
const userRegister = catchAsync(async (req: Request, res: Response) => {
  const { ...userInfo } = req.body;

  const result = await UserService.userRegister(userInfo);

  setAuthCookie(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Registration Successful",
    data: result,
  });
});

// User Login
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...authCredentials } = req.body;

  const result = await UserService.userLogin(authCredentials);

  setAuthCookie(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login Successful",
    data: result,
  });
});

// Get User
const getAuthenticatedUserDetails = catchAsync(
  async (req: Request, res: Response) => {
    const token = jwtHelpers.verifyAuthToken(req);

    const result = await UserService.getAuthenticatedUserDetails(token);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Details Retrieved Successfully",
      data: result,
    });
  },
);

// Logout
const logout = catchAsync(async (req: Request, res: Response) => {
  await UserService.logout(res);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

// Update User
const updatedUser = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updateUser(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: result,
  });
});

// Update Password
const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updatePassword(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: result,
  });
});

// Get All Users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserFilterableFields);
  const options = pick(req.query, paginationFields);
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.getAllUsers(filters, options, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: result,
  });
});

// Delete User
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser({ id });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Deleted Successfully",
    data: result,
  });
});

// Public User
const getPublicProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getPublicProfile(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Public Profile Retrieved Successfully",
    data: result,
  });
});

export const UserController = {
  userRegister,
  userLogin,
  getAuthenticatedUserDetails,
  logout,
  updatedUser,
  updatePassword,
  getAllUsers,
  deleteUser,
  getPublicProfile,
};

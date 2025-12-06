import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

// All Orders
const getAdminOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminOverview();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Overview Retrieved",
    data: result,
  });
});

export const AdminController = {
  getAdminOverview,
};

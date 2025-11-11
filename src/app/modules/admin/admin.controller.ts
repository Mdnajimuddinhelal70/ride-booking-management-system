import { Request, Response } from "express";

import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { search, role, status } = req.query;

  const result = await AdminService.getAllUsers(
    search as string,
    role as string,
    status as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users fetched successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await AdminService.updateUserStatus(
    id,
    status as "Active" | "Blocked"
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status updated to ${status}`,
    data: result,
  });
});

const updateDriverApproval = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approval } = req.body;

  const result = await AdminService.updateDriverApproval(
    id,
    approval as "Approved" | "Suspended"
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Driver approval status updated to ${approval}`,
    data: result,
  });
});

const getAllRides = async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await AdminService.getAllRides(filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All rides fetched successfully",
    data: result,
  });
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  updateDriverApproval,
  getAllRides,
};

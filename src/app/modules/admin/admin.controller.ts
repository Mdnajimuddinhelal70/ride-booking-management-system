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

// ========================================================
const summary = async (req: Request, res: Response) => {
  // const { startDate, endDate } = req.query;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  const data = await AdminService.getSummary(startDate, endDate);
  res.json({ success: true, data });
};

const trends = async (req: Request, res: Response) => {
  const { metric = "rides", groupBy = "day", startDate, endDate } = req.query;

  const data = await AdminService.getTrends(
    metric as "rides" | "revenue",
    groupBy as "day" | "week" | "month",
    startDate as string,
    endDate as string
  );
  res.json({ success: true, data });
};

const topDrivers = async (req: Request, res: Response) => {
  const { startDate, endDate, limit = 10, sortBy = "rides" } = req.query;
  const data = await AdminService.getTopDrivers(
    startDate as string,
    endDate as string,
    Number(limit),
    sortBy as "rides"
  );
  res.json({ success: true, data });
};

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const updatedUser = await AdminService.updateProfile(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Profile updated successfully.",
    data: updatedUser,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  const updatedUser = await AdminService.changePassword(
    userId,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Password updated successfully.",
    data: updatedUser,
  });
});
export const AdminController = {
  getAllUsers,
  updateUserStatus,
  updateDriverApproval,
  getAllRides,
  summary,
  trends,
  topDrivers,
  updateProfile,
  changePassword,
};

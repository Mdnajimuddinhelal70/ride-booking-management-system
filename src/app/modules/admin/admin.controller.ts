/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, status, search } = req.query;

  const filter: any = {};

  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  const users = await AdminServices.getAllUsers(filter);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedUser = await AdminServices.updateUserStatus(id, status);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `User ${status} successfully`,
    data: updatedUser,
  });
});

export const AdminController = {
  getAllUsers,
  updateUserStatus,
};

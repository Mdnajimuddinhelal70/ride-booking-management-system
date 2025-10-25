/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsers(
      query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieved Successfully",
      data: result.data,
    });
  }
);
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;

  const user = await UserService.getUserById(userId);

  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
      data: null,
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: user,
  });
});

const blockOrUnblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  const updatedUser = await UserService.blockOrUnblockUser(id, isBlocked);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User has been ${
      isBlocked ? "blocked" : "unblocked"
    } successfully`,
    data: updatedUser,
  });
});

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Your profile Retrieved Successfully",
      data: result.data,
    });
  }
);

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { name, phoneNumber } = req.body;

  const result = await UserService.updateProfile(userId, { name, phoneNumber });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getMyProfile,
  blockOrUnblockUser,
  getMe,
  updateProfile,
};

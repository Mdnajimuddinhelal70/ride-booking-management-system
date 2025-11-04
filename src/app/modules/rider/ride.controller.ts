/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";

const createRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user.id;
    const riderEmail = req.user.email;
    const ridePayload = {
      ...req.body,
      riderId,
      riderEmail,
    };

    const result = await RideService.createRideRequest(ridePayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride created successfully!",
      data: result,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAllRides();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rides retrieved successfully!",
      data: result,
    });
  }
);

const getRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderEmail = req.user.email;
    const result = await RideService.getRideHistory(riderEmail);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride history fetched successfully",
      data: result,
    });
  }
);

const handleRideAction = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const { action } = req.body;
  const driverId = req.user?.id;

  if (!["accept", "reject"].includes(action)) {
    throw new AppError(400, "Invalid action");
  }

  const result = await RideService.handleRideAction(
    rideId,
    driverId,
    action as "accept" | "reject"
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Ride ${action} successfully!`,
    data: result,
  });
});

const getDriverEarningsController = catchAsync(
  async (req: Request, res: Response) => {
    const driverId = req.user._id;
    const earningsData = await RideService.getDriverEarnings(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver earnings fetched successfully!",
      data: earningsData,
    });
  }
);

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const { status } = req.body;
  const result = await RideService.updateRideStatus(rideId, status);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride status updated",
    data: result,
  });
});

export const RideController = {
  createRideRequest,
  getAllRides,
  handleRideAction,
  getDriverEarningsController,
  getRideHistory,
  updateRideStatus,
};

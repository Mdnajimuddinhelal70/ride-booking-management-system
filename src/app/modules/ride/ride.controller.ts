/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "./../../utils/catchAsync";
import { RideService } from "./ride.service";

const createRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user._id;
    const ridePayload = {
      ...req.body,
      riderId,
    };

    const result = await RideService.createRide(ridePayload);

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

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await RideService.cancelRide(id, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride cancelled successfully!",
      data: result,
    });
  }
);

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const driverId = req.user._id;

  const result = await RideService.acceptRide(rideId, driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride accepted successfully!",
    data: result,
  });
});

const rejectRide = catchAsync(async (req: Request, res: Response) => {
  const { id: rideId } = req.params;
  const driverId = req.user._id;

  const result = await RideService.rejectRide(rideId, driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride rejected successfully!",
    data: result,
  });
});

const updateRideStatus = catchAsync(async (req, res) => {
  const rideId = req.params.rideId;
  const userId = req.user._id;
  const userRole = req.user.role;
  const { status } = req.body;

  const ride = await RideService.updateRideStatus(
    rideId,
    status,
    userRole,
    userId
  );

  res.status(200).json({
    success: true,
    message: "Ride status updated successfully",
    data: ride,
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

export const RideController = {
  createRide,
  getAllRides,
  cancelRide,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getDriverEarningsController,
};

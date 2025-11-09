import httpStatus from "http-status-codes";
// controllers/driver.controller.ts
import { Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Ride } from "../rider/ride.model";
import { DriverService } from "./driver.service";

const getDrivers = catchAsync(async (req: Request, res: Response) => {
  const { role, email } = req.user;
  const drivers = await DriverService.getDrivers(role, email);
  res.status(200).json({
    success: true,
    message: "Drivers fetched successfully",
    data: drivers,
  });
});
const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.id;

  const { availability } = req.body || {};
  const ALLOWED_AVAILABILITY = ["online", "offline", "busy"];

  if (availability === undefined) {
    throw new AppError(400, "Availability is required");
  }

  if (!ALLOWED_AVAILABILITY.includes(availability)) {
    throw new AppError(400, "Invalid availability value");
  }

  const result = await DriverService.updateAvailability(driverId, availability);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Availability updated to ${availability}`,
    data: result,
  });
});

const getRequestedRides = catchAsync(async (req, res) => {
  const rides = await Ride.find({ status: "requested" }).populate("riderId");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Requested rides fetched successfully",
    data: rides,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const { isApproved } = req.body;

  if (typeof isApproved !== "boolean") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Invalid status value",
      data: null,
    });
  }

  const updatedDriver = await DriverService.updateStatus(driverId, isApproved);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver approval status updated successfully",
    data: updatedDriver,
  });
});

const getRideHistory = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;

  const result = await DriverService.getRideHistory({
    driverId: req.user?.id,
    page: Number(page),
    limit: Number(limit),
    status: status as string,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride history fetched successfully",
    data: result,
  });
});

const getDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user?.id;
  const result = await DriverService.getDriverProfile(driverId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const driverUpdateProfile = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user?.id;
  const result = await DriverService.driverUpdateProfile(driverId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const DriverController = {
  getDrivers,
  updateAvailability,
  updateStatus,
  getRequestedRides,
  getRideHistory,
  getDriverProfile,
  driverUpdateProfile,
};

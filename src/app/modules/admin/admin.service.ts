/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Ride } from "../rider/ride.model";
import { User } from "../user/user.model";

const getAllUsers = async (search?: string, role?: string, status?: string) => {
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) query.role = role;
  if (status) query.status = status;

  const users = await User.find(query).sort({ createdAt: -1 });
  return users;
};

const updateUserStatus = async (id: string, status: "Active" | "Blocked") => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.status = status;
  user.isBlocked = status === "Blocked";
  await user.save();

  return user;
};

const updateDriverApproval = async (
  id: string,
  approval: "Approved" | "Suspended"
) => {
  const driver = await User.findById(id);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (driver.role !== "driver") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not a driver");
  }

  (driver as any).driverApproval = approval;
  await driver.save();

  return driver;
};

const getAllRides = async (filters: any) => {
  const query: any = {};

  // status filter
  if (filters.status) query.status = filters.status;

  // driver filter
  if (filters.driver) query.driver = new Types.ObjectId(filters.driver);

  // rider filter
  if (filters.rider) query.rider = new Types.ObjectId(filters.rider);

  // date range filter
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  // find with populated driver & rider info
  const rides = await Ride.find(query)
    .populate("riderId", "name email")
    .populate("driverId", "name email")
    .sort({ createdAt: -1 });

  return rides;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  updateDriverApproval,
  getAllRides,
};

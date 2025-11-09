/* eslint-disable @typescript-eslint/no-explicit-any */
// services/driver.service.ts

import AppError from "../../errorHelpers/AppError";
import { Ride } from "../rider/ride.model";
import { AvailabilityStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";

const getDrivers = async (role: string, email: string) => {
  if (role === "admin") {
    return await Driver.find();
  } else {
    return await Driver.find({ email });
  }
};

const getRequestedRide = async () => {
  return await Ride.find({ status: "requested" });
};

const updateAvailability = async (
  driverId: string,
  availability: AvailabilityStatus
) => {
  const driver = await User.findById(driverId).select("+availability");

  if (!driver) {
    throw new AppError(404, "Driver not found");
  }

  if (driver.role !== "driver") {
    throw new AppError(403, "Only drivers can update availability");
  }

  driver.availability = availability;
  await driver.save();

  return {
    _id: driver._id,
    name: driver.name,
    role: driver.role,
    availability: driver.availability,
  };
};

const updateStatus = async (driverId: string, isApproved: boolean) => {
  const updatedDriver = await User.findOneAndUpdate(
    { _id: driverId, role: "driver" },
    { isApproved },
    { new: true }
  );
  if (!updatedDriver) {
    throw new Error("Driver not found");
  }
  return updatedDriver;
};
const getRideHistory = async ({
  driverId,
  page,
  limit,
  status,
}: {
  driverId: string;
  page: number;
  limit: number;
  status?: string;
}) => {
  const filter: any = { driverId };

  if (status) {
    filter.status = status;
  }

  const rides = await Ride.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Ride.countDocuments(filter);

  return {
    rides,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

const getDriverProfile = async (driverId: string) => {
  if (!driverId) {
    throw new AppError(400, "Driver ID not found!");
  }

  const driver = await User.findById(driverId).select(
    "name email phoneNumber role vehicleInfo"
  );

  if (!driver) {
    throw new AppError(404, "Driver not found!");
  }

  return driver;
};

const driverUpdateProfile = async (
  driverId: string,
  payload: Partial<IDriver>
) => {
  return await Driver.findByIdAndUpdate(driverId, payload, { new: true });
};
export const DriverService = {
  getDrivers,
  updateAvailability,
  updateStatus,
  getRequestedRide,
  getRideHistory,
  getDriverProfile,
  driverUpdateProfile,
};

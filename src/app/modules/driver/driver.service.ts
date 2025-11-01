// services/driver.service.ts

import AppError from "../../errorHelpers/AppError";
import { AvailabilityStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import { Driver } from "./driver.model";

const getDrivers = async (role: string, email: string) => {
  if (role === "admin") {
    return await Driver.find();
  } else {
    return await Driver.find({ email });
  }
};

// const updateAvailability = async (
//   driverId: string,
//   availability: "online" | "offline"
// ) => {
//   const updatedDriver = await User.findOneAndUpdate(
//     { _id: driverId, role: "driver" },
//     { availability },
//     { new: true }
//   );
//   if (!updatedDriver) {
//     throw new Error("Driver not found");
//   }
//   return updatedDriver;
// };

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
export const DriverService = {
  getDrivers,
  updateAvailability,
  updateStatus,
};

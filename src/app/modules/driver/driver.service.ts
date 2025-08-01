// services/driver.service.ts

import { User } from "../user/user.model";
import { Driver } from "./driver.model";

const getDrivers = async (role: string, email: string) => {
  if (role === "admin") {
    return await Driver.find();
  } else {
    return await Driver.find({ email });
  }
};

const updateAvailability = async (
  driverId: string,
  availability: "online" | "offline"
) => {
  const updatedDriver = await User.findOneAndUpdate(
    { _id: driverId, role: "driver" },
    { availability },
    { new: true }
  );
  if (!updatedDriver) {
    throw new Error("Driver not found");
  }
  return updatedDriver;
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

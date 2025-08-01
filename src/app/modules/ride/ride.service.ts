import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { UserRole } from "../user/user.interface";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const createRide = async (payload: Partial<IRide>) => {
  const ride = await Ride.create(payload);
  return ride;
};

const getAllRides = async (): Promise<IRide[]> => {
  return await Ride.find().populate("riderId driverId");
};

const cancelRide = async (rideId: string, userId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found!");
  }

  if (ride.riderId.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized to cancel this ride!"
    );
  }

  const now = new Date();
  const requestedAt = new Date(ride.requestedAt);
  const diffInMinutes = (now.getTime() - requestedAt.getTime()) / (1000 * 60);

  if (diffInMinutes > 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cancellation window expired!");
  }

  ride.status = "cancelled";
  ride.updatedAt = new Date();

  await ride.save();
  return ride;
};

const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.status !== "requested") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride is not available for acceptance"
    );
  }

  ride.status = "accepted";
  ride.driverId = new Types.ObjectId(driverId);
  await ride.save();

  return ride;
};

const rejectRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.status !== "requested") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride is not available for rejection"
    );
  }

  ride.status = "rejected";
  ride.driverId = new Types.ObjectId(driverId).toString();
  await ride.save();

  return ride;
};

const updateRideStatus = async (
  rideId: string,
  status: RideStatus,
  userRole: string,
  userId: string
) => {
  let ride;

  if (userRole === UserRole.Admin) {
    ride = await Ride.findById(rideId);
  } else if (userRole === UserRole.Driver) {
    ride = await Ride.findOne({ _id: rideId, driverId: userId });
  }

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found or access denied");
  }

  const historyEntry = {
    status,
    updatedAt: new Date(),
  };

  ride.statusHistory = ride.statusHistory || [];
  ride.statusHistory.push(historyEntry);
  ride.status = status;

  await ride.save();
  return ride;
};

const getDriverEarnings = async (driverId: string) => {
  // শুধু completed ride যেগুলো এই ড্রাইভারের
  const completedRides = await Ride.find({ driverId, status: "completed" });

  const totalEarnings = completedRides.reduce(
    (acc, ride) => acc + (ride.ridePrice || 0),
    0
  );

  return {
    totalRides: completedRides.length,
    totalEarnings,
    rides: completedRides,
  };
};

export const RideService = {
  createRide,
  getAllRides,
  cancelRide,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getDriverEarnings,
};

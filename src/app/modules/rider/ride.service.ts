import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const createRideRequest = async (payload: Partial<IRide>) => {
  const availableDriver = await User.findOne({
    role: "driver",
    availability: "online",
  });

  if (!availableDriver) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "No available drivers right now. Please try again later."
    );
  }

  payload.driverId = availableDriver._id;
  payload.status = "requested";
  payload.requestedAt = new Date();

  availableDriver.availability = "busy";
  await availableDriver.save();

  const ride = await Ride.create(payload);
  return ride;
};

const getAllRides = async () => {
  return await Ride.find();
};

const getRideHistory = async (riderEmail: string) => {
  const rides = await Ride.find({ riderEmail }).sort({ createdAt: -1 });
  return rides;
};

const handleRideAction = async (
  rideId: string,
  driverId: string,
  action: "accept" | "reject"
) => {
  const ride = await Ride.findById(rideId);

  if (!ride) throw new AppError(404, "Ride not found");

  if (ride.status !== "requested") {
    throw new AppError(400, "Ride is already processed by another driver");
  }

  if (action === "accept") {
    ride.status = "accepted";
    ride.driverId = driverId;
  }

  if (action === "reject") {
    ride.status = "rejected";
    ride.driverId = null;
  }

  await ride.save();
  return ride;
};

const getDriverEarnings = async (driverId: string) => {
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

// const updateRideStatus = async (rideId: string, status: string) => {
//   const allowedStatus = [
//     "accepted",
//     "picked_up",
//     "in_transit",
//     "completed",
//     "cancelled",
//   ];

//   if (!allowedStatus.includes(status)) {
//     throw new AppError(httpStatus.FORBIDDEN, "Invalid ride status");
//   }

//   const ride = await Ride.findByIdAndUpdate(rideId, { status }, { new: true });
//   if (!ride) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Found!");
//   }

//   return ride;
// };

const allowedStatusOrder: RideStatus[] = [
  "accepted",
  "picked_up",
  "in_transit",
  "completed",
];

const updateRideStatus = async (
  rideId: string,
  driverId: string,
  newStatus: RideStatus
) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found!");
  }

  // Check ride belongs to driver
  if (ride.driverId?.toString() !== driverId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not the driver of this ride"
    );
  }

  // Sequence Check
  const currentIndex = allowedStatusOrder.indexOf(ride.status);
  const newIndex = allowedStatusOrder.indexOf(newStatus);

  if (newIndex !== currentIndex + 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status sequence");
  }

  ride.status = newStatus;
  await ride.save();

  return ride;
};

const getActiveRide = async (driverId: string) => {
  if (!driverId) {
    throw new AppError(httpStatus.FORBIDDEN, "Driver Not Found!");
  }

  const activeRide = await Ride.findOne({
    driverId,
    status: { $in: ["accepted", "picked_up", "in_transit"] },
  });
  return activeRide;
};

export const RideService = {
  createRideRequest,
  getAllRides,
  handleRideAction,
  getDriverEarnings,
  getRideHistory,
  updateRideStatus,
  getActiveRide,
};

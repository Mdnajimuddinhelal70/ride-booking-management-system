import bcryptjs from "bcryptjs";
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

// +================================================================
const getSummary = async (startDate?: string, endDate?: string) => {
  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const aggregation = await Ride.aggregate([
    { $match: match },
    {
      $facet: {
        totalRides: [{ $count: "count" }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        totalRevenue: [
          { $group: { _id: null, total: { $sum: "$ridePrice" } } },
        ],
        avgFare: [{ $group: { _id: null, avgFare: { $avg: "$ridePrice" } } }],
        activeDrivers: [{ $group: { _id: "$driverId" } }, { $count: "count" }],
      },
    },
  ]);

  const res = aggregation[0] || {};
  return {
    totalRides: res.totalRides[0]?.count || 0,
    byStatus: (res.byStatus || []).reduce((acc: any, cur: any) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {}),
    totalRevenue: res.totalRevenue[0]?.total || 0,
    avgFare: res.avgFare[0]?.avgFare || 0,
    activeDrivers: res.activeDrivers[0]?.count || 0,
  };
};

//step-2
const getTrends = async (
  metric: "rides" | "revenue",
  groupBy: "day" | "week" | "month",
  startDate?: string,
  endDate?: string
) => {
  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const dateTruncUnit = groupBy;
  const groupStage: any = {
    _id: {
      $dateTrunc: { date: "$createdAt", unit: dateTruncUnit },
    },
  };

  if (metric === "rides") {
    groupStage.count = { $sum: 1 };
  } else {
    // revenue
    groupStage.total = { $sum: "$ridePrice" };
  }

  const agg = await Ride.aggregate([
    { $match: match },
    { $group: groupStage },
    { $sort: { _id: 1 } },
    {
      $project: {
        period: "$_id",
        value: metric === "rides" ? "$count" : "$total",
        _id: 0,
      },
    },
  ]);

  return agg.map((r: any) => ({ period: r.period, value: r.value }));
};

//Step-3
const getTopDrivers = async (
  startDate?: string,
  endDate?: string,
  limit = 10,
  sortBy: "rides" | "earnings" = "rides"
) => {
  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const agg = await Ride.aggregate([
    { $match: { ...match, driverId: { $ne: null } } },
    {
      $group: {
        _id: "$driverId",
        ridesCount: { $sum: 1 },
        totalEarnings: { $sum: "$ridePrice" },
        avgFare: { $avg: "$ridePrice" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "driver",
      },
    },
    { $unwind: "$driver" },
    {
      $project: {
        driverId: "$_id",
        name: "$driver.name",
        email: "$driver.email",
        ridesCount: 1,
        totalEarnings: 1,
        avgFare: 1,
        _id: 0,
      },
    },
    { $sort: sortBy === "rides" ? { ridesCount: -1 } : { totalEarnings: -1 } },
    { $limit: limit },
  ]);

  return agg;
};

// ==============================================================================
const updateProfile = async (userId: string, payload: any) => {
  const users = await User.findByIdAndUpdate(userId, payload, { new: true });
  if (!users) throw new Error("User not found");
  return users;
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcryptjs.compare(oldPassword, user.password as string);
  if (!isMatch) throw new Error("Old password is incorrect");

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return user;
};
export const AdminService = {
  getAllUsers,
  updateUserStatus,
  updateDriverApproval,
  getAllRides,
  getSummary,
  getTrends,
  getTopDrivers,
  updateProfile,
  changePassword,
};

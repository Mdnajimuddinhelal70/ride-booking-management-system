"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_model_1 = require("../rider/ride.model");
const user_model_1 = require("../user/user.model");
const getAllUsers = (search, role, status) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    if (role)
        query.role = role;
    if (status)
        query.status = status;
    const users = yield user_model_1.User.find(query).sort({ createdAt: -1 });
    return users;
});
const updateUserStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    user.status = status;
    user.isBlocked = status === "Blocked";
    yield user.save();
    return user;
});
const updateDriverApproval = (id, approval) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(id);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.role !== "driver") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not a driver");
    }
    driver.driverApproval = approval;
    yield driver.save();
    return driver;
});
const getAllRides = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    // status filter
    if (filters.status)
        query.status = filters.status;
    // driver filter
    if (filters.driver)
        query.driver = new mongoose_1.Types.ObjectId(filters.driver);
    // rider filter
    if (filters.rider)
        query.rider = new mongoose_1.Types.ObjectId(filters.rider);
    // date range filter
    if (filters.startDate && filters.endDate) {
        query.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
        };
    }
    // find with populated driver & rider info
    const rides = yield ride_model_1.Ride.find(query)
        .populate("riderId", "name email")
        .populate("driverId", "name email")
        .sort({ createdAt: -1 });
    return rides;
});
// +================================================================
const getSummary = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const match = {};
    if (startDate || endDate) {
        match.createdAt = {};
        if (startDate)
            match.createdAt.$gte = new Date(startDate);
        if (endDate)
            match.createdAt.$lte = new Date(endDate);
    }
    const aggregation = yield ride_model_1.Ride.aggregate([
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
        totalRides: ((_a = res.totalRides[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
        byStatus: (res.byStatus || []).reduce((acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        }, {}),
        totalRevenue: ((_b = res.totalRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
        avgFare: ((_c = res.avgFare[0]) === null || _c === void 0 ? void 0 : _c.avgFare) || 0,
        activeDrivers: ((_d = res.activeDrivers[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
    };
});
//step-2
const getTrends = (metric, groupBy, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const match = {};
    if (startDate || endDate) {
        match.createdAt = {};
        if (startDate)
            match.createdAt.$gte = new Date(startDate);
        if (endDate)
            match.createdAt.$lte = new Date(endDate);
    }
    const dateTruncUnit = groupBy;
    const groupStage = {
        _id: {
            $dateTrunc: { date: "$createdAt", unit: dateTruncUnit },
        },
    };
    if (metric === "rides") {
        groupStage.count = { $sum: 1 };
    }
    else {
        // revenue
        groupStage.total = { $sum: "$ridePrice" };
    }
    const agg = yield ride_model_1.Ride.aggregate([
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
    return agg.map((r) => ({ period: r.period, value: r.value }));
});
//Step-3
const getTopDrivers = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, limit = 10, sortBy = "rides") {
    const match = {};
    if (startDate || endDate) {
        match.createdAt = {};
        if (startDate)
            match.createdAt.$gte = new Date(startDate);
        if (endDate)
            match.createdAt.$lte = new Date(endDate);
    }
    const agg = yield ride_model_1.Ride.aggregate([
        { $match: Object.assign(Object.assign({}, match), { driverId: { $ne: null } }) },
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
});
// ==============================================================================
const updateProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
    if (!users)
        throw new Error("User not found");
    return users;
});
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isMatch)
        throw new Error("Old password is incorrect");
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    yield user.save();
    return user;
});
exports.AdminService = {
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

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
exports.RideService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("./ride.model");
const createRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const availableDriver = yield user_model_1.User.findOne({
        role: "driver",
        availability: "online",
    });
    if (!availableDriver) {
        throw new AppError_1.default(http_status_codes_1.default.SERVICE_UNAVAILABLE, "No available drivers right now. Please try again later.");
    }
    payload.driverId = availableDriver._id;
    payload.status = "requested";
    payload.requestedAt = new Date();
    availableDriver.availability = "busy";
    yield availableDriver.save();
    const ride = yield ride_model_1.Ride.create(payload);
    return ride;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find().populate("riderId driverId");
});
const cancelRide = (rideId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found!");
    }
    if (ride.riderId.toString() !== userId.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized to cancel this ride!");
    }
    const now = new Date();
    const requestedAt = new Date(ride.requestedAt);
    const diffInMinutes = (now.getTime() - requestedAt.getTime()) / (1000 * 60);
    if (diffInMinutes > 10) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cancellation window expired!");
    }
    ride.status = "cancelled";
    ride.updatedAt = new Date();
    yield ride.save();
    return ride;
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.status !== "requested") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride is not available for acceptance");
    }
    ride.status = "accepted";
    ride.driverId = new mongoose_1.Types.ObjectId(driverId);
    yield ride.save();
    return ride;
});
const rejectRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.status !== "requested") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride is not available for rejection");
    }
    ride.status = "rejected";
    ride.driverId = new mongoose_1.Types.ObjectId(driverId).toString();
    yield ride.save();
    return ride;
});
const updateRideStatus = (rideId, status, userRole, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let ride;
    if (userRole === user_interface_1.UserRole.Admin) {
        ride = yield ride_model_1.Ride.findById(rideId);
    }
    else if (userRole === user_interface_1.UserRole.Driver) {
        ride = yield ride_model_1.Ride.findOne({ _id: rideId, driverId: userId });
    }
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or access denied");
    }
    const historyEntry = {
        status,
        updatedAt: new Date(),
    };
    ride.statusHistory = ride.statusHistory || [];
    ride.statusHistory.push(historyEntry);
    ride.status = status;
    yield ride.save();
    return ride;
});
const getDriverEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const completedRides = yield ride_model_1.Ride.find({ driverId, status: "completed" });
    const totalEarnings = completedRides.reduce((acc, ride) => acc + (ride.ridePrice || 0), 0);
    return {
        totalRides: completedRides.length,
        totalEarnings,
        rides: completedRides,
    };
});
exports.RideService = {
    createRide,
    getAllRides,
    cancelRide,
    acceptRide,
    rejectRide,
    updateRideStatus,
    getDriverEarnings,
};

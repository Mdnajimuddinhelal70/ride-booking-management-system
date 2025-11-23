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
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("./ride.model");
const createRideRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield ride_model_1.Ride.find();
});
const getRideHistory = (riderEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ riderEmail }).sort({ createdAt: -1 });
    return rides;
});
const handleRideAction = (rideId, driverId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.default(404, "Ride not found");
    if (ride.status !== "requested") {
        throw new AppError_1.default(400, "Ride is already processed by another driver");
    }
    if (action === "accept") {
        ride.status = "accepted";
        ride.driverId = driverId;
    }
    if (action === "reject") {
        ride.status = "rejected";
        ride.driverId = null;
    }
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
const allowedStatusOrder = [
    "accepted",
    "picked_up",
    "in_transit",
    "completed",
];
const updateRideStatus = (rideId, driverId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found!");
    }
    // Check ride belongs to driver
    if (((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not the driver of this ride");
    }
    // Sequence Check
    const currentIndex = allowedStatusOrder.indexOf(ride.status);
    const newIndex = allowedStatusOrder.indexOf(newStatus);
    if (newIndex !== currentIndex + 1) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid status sequence");
    }
    ride.status = newStatus;
    yield ride.save();
    return ride;
});
const getActiveRide = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!driverId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Driver Not Found!");
    }
    const activeRide = yield ride_model_1.Ride.findOne({
        driverId,
        status: { $in: ["accepted", "picked_up", "in_transit"] },
    });
    return activeRide;
});
exports.RideService = {
    createRideRequest,
    getAllRides,
    handleRideAction,
    getDriverEarnings,
    getRideHistory,
    updateRideStatus,
    getActiveRide,
};

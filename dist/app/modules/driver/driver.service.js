"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// services/driver.service.ts
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
exports.DriverService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_model_1 = require("../rider/ride.model");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const getDrivers = (role, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "admin") {
        return yield driver_model_1.Driver.find();
    }
    else {
        return yield driver_model_1.Driver.find({ email });
    }
});
const getRequestedRide = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ status: "requested" });
});
const updateAvailability = (driverId, availability) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(driverId).select("+availability");
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found");
    }
    if (driver.role !== "driver") {
        throw new AppError_1.default(403, "Only drivers can update availability");
    }
    driver.availability = availability;
    yield driver.save();
    return {
        _id: driver._id,
        name: driver.name,
        role: driver.role,
        availability: driver.availability,
    };
});
const updateStatus = (driverId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriver = yield user_model_1.User.findOneAndUpdate({ _id: driverId, role: "driver" }, { isApproved }, { new: true });
    if (!updatedDriver) {
        throw new Error("Driver not found");
    }
    return updatedDriver;
});
const getRideHistory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ driverId, page, limit, status, }) {
    const filter = { driverId };
    if (status) {
        filter.status = status;
    }
    const rides = yield ride_model_1.Ride.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield ride_model_1.Ride.countDocuments(filter);
    return {
        rides,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
});
const getDriverProfile = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!driverId) {
        throw new AppError_1.default(400, "Driver ID not found!");
    }
    const driver = yield user_model_1.User.findById(driverId).select("name email phoneNumber role vehicleInfo");
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found!");
    }
    return driver;
});
const driverUpdateProfile = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield driver_model_1.Driver.findByIdAndUpdate(driverId, payload, { new: true });
});
exports.DriverService = {
    getDrivers,
    updateAvailability,
    updateStatus,
    getRequestedRide,
    getRideHistory,
    getDriverProfile,
    driverUpdateProfile,
};

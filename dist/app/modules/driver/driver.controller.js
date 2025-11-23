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
exports.DriverController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_model_1 = require("../rider/ride.model");
const driver_service_1 = require("./driver.service");
const getDrivers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = req.user;
    const drivers = yield driver_service_1.DriverService.getDrivers(role, email);
    res.status(200).json({
        success: true,
        message: "Drivers fetched successfully",
        data: drivers,
    });
}));
const updateAvailability = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.id;
    const { availability } = req.body || {};
    const ALLOWED_AVAILABILITY = ["online", "offline", "busy"];
    if (availability === undefined) {
        throw new AppError_1.default(400, "Availability is required");
    }
    if (!ALLOWED_AVAILABILITY.includes(availability)) {
        throw new AppError_1.default(400, "Invalid availability value");
    }
    const result = yield driver_service_1.DriverService.updateAvailability(driverId, availability);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Availability updated to ${availability}`,
        data: result,
    });
}));
const getRequestedRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ status: "requested" }).populate("riderId");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Requested rides fetched successfully",
        data: rides,
    });
}));
const updateStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const { isApproved } = req.body;
    if (typeof isApproved !== "boolean") {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Invalid status value",
            data: null,
        });
    }
    const updatedDriver = yield driver_service_1.DriverService.updateStatus(driverId, isApproved);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver approval status updated successfully",
        data: updatedDriver,
    });
}));
const getRideHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 1, limit = 10, status } = req.query;
    const result = yield driver_service_1.DriverService.getRideHistory({
        driverId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        page: Number(page),
        limit: Number(limit),
        status: status,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride history fetched successfully",
        data: result,
    });
}));
const getDriverProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield driver_service_1.DriverService.getDriverProfile(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Profile fetched successfully",
        data: result,
    });
}));
const driverUpdateProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield driver_service_1.DriverService.driverUpdateProfile(driverId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
}));
exports.DriverController = {
    getDrivers,
    updateAvailability,
    updateStatus,
    getRequestedRides,
    getRideHistory,
    getDriverProfile,
    driverUpdateProfile,
};

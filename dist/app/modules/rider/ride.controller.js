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
exports.RideController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
const createRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.id;
    const riderEmail = req.user.email;
    const ridePayload = Object.assign(Object.assign({}, req.body), { riderId,
        riderEmail });
    const result = yield ride_service_1.RideService.createRideRequest(ridePayload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride created successfully!",
        data: result,
    });
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAllRides();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All rides retrieved successfully!",
        data: result,
    });
}));
const getRideHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const riderEmail = req.user.email;
    const result = yield ride_service_1.RideService.getRideHistory(riderEmail);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Ride history fetched successfully",
        data: result,
    });
}));
const handleRideAction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rideId = req.params.id;
    const { action } = req.body;
    const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!["accept", "reject"].includes(action)) {
        throw new AppError_1.default(400, "Invalid action");
    }
    const result = yield ride_service_1.RideService.handleRideAction(rideId, driverId, action);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Ride ${action} successfully!`,
        data: result,
    });
}));
const getDriverEarningsController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user._id;
    const earningsData = yield ride_service_1.RideService.getDriverEarnings(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver earnings fetched successfully!",
        data: earningsData,
    });
}));
const updateRideStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { status } = req.body;
    const rideId = req.params.id;
    const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield ride_service_1.RideService.updateRideStatus(rideId, driverId, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Ride status updated",
        data: result,
    });
}));
// const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
//   const { status } = req.body;
//   const rideId = req.params.id;
//   const result = await RideService.updateRideStatus(rideId, status);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Ride status updated",
//     data: result,
//   });
// });
const getActiveRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.id;
    const ride = yield ride_service_1.RideService.getActiveRide(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Active ride fetched successfully",
        data: ride,
    });
}));
exports.RideController = {
    createRideRequest,
    getAllRides,
    handleRideAction,
    getDriverEarningsController,
    getRideHistory,
    updateRideStatus,
    getActiveRide,
};

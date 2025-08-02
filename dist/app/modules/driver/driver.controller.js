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
// const updateAvailability = catchAsync(async (req: Request, res: Response) => {
//   const driverId = req.params.id;
//   const { availability } = req.body;
//   if (availability !== "online" && availability !== "offline") {
//     return sendResponse(res, {
//       success: false,
//       statusCode: httpStatus.BAD_REQUEST,
//       message: "Invalid availability value",
//       data: null,
//     });
//   }
//   const updatedDriver = await DriverService.updateAvailability(
//     driverId,
//     availability
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Driver availability updated successfully",
//     data: updatedDriver,
//   });
// });
const updateAvailability = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user._id;
    const { availability } = req.body;
    if (!["online", "offline", "busy"].includes(availability)) {
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
exports.DriverController = {
    getDrivers,
    updateAvailability,
    updateStatus,
};

"use strict";
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
// const updateAvailability = async (
//   driverId: string,
//   availability: "online" | "offline"
// ) => {
//   const updatedDriver = await User.findOneAndUpdate(
//     { _id: driverId, role: "driver" },
//     { availability },
//     { new: true }
//   );
//   if (!updatedDriver) {
//     throw new Error("Driver not found");
//   }
//   return updatedDriver;
// };
const updateAvailability = (driverId, availability) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found");
    }
    if (driver.role !== "driver") {
        throw new AppError_1.default(403, "Only drivers can update availability");
    }
    driver.availability = availability;
    yield driver.save();
    return driver;
});
const updateStatus = (driverId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriver = yield user_model_1.User.findOneAndUpdate({ _id: driverId, role: "driver" }, { isApproved }, { new: true });
    if (!updatedDriver) {
        throw new Error("Driver not found");
    }
    return updatedDriver;
});
exports.DriverService = {
    getDrivers,
    updateAvailability,
    updateStatus,
};

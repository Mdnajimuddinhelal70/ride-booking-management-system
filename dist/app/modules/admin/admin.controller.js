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
exports.AdminController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, role, status } = req.query;
    const result = yield admin_service_1.AdminService.getAllUsers(search, role, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All users fetched successfully",
        data: result,
    });
}));
const updateUserStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield admin_service_1.AdminService.updateUserStatus(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `User status updated to ${status}`,
        data: result,
    });
}));
const updateDriverApproval = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { approval } = req.body;
    const result = yield admin_service_1.AdminService.updateDriverApproval(id, approval);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Driver approval status updated to ${approval}`,
        data: result,
    });
}));
const getAllRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    const result = yield admin_service_1.AdminService.getAllRides(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All rides fetched successfully",
        data: result,
    });
});
// ========================================================
const summary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { startDate, endDate } = req.query;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const data = yield admin_service_1.AdminService.getSummary(startDate, endDate);
    res.json({ success: true, data });
});
const trends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { metric = "rides", groupBy = "day", startDate, endDate } = req.query;
    const data = yield admin_service_1.AdminService.getTrends(metric, groupBy, startDate, endDate);
    res.json({ success: true, data });
});
const topDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, limit = 10, sortBy = "rides" } = req.query;
    const data = yield admin_service_1.AdminService.getTopDrivers(startDate, endDate, Number(limit), sortBy);
    res.json({ success: true, data });
});
const updateProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updatedUser = yield admin_service_1.AdminService.updateProfile(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Profile updated successfully.",
        data: updatedUser,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const updatedUser = yield admin_service_1.AdminService.changePassword(userId, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Password updated successfully.",
        data: updatedUser,
    });
}));
exports.AdminController = {
    getAllUsers,
    updateUserStatus,
    updateDriverApproval,
    getAllRides,
    summary,
    trends,
    topDrivers,
    updateProfile,
    changePassword,
};

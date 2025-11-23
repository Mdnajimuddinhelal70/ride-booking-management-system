"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.getAllUsers);
router.patch("/user/:id/status", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.updateUserStatus);
router.patch("/driver/:id/approval", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.updateDriverApproval);
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.getAllRides);
//============================================
router.get("/summary", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.summary);
router.get("/trends", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.trends);
router.get("/drivers", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.topDrivers);
router.put("/:id/profile", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.updateProfile);
router.put("/:id/change-password", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin), admin_controller_1.AdminController.changePassword);
exports.AdminRoutes = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoute = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const driver_controller_1 = require("./driver.controller");
const router = (0, express_1.Router)();
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Driver), driver_controller_1.DriverController.getDrivers);
// router.patch(
//   "/:id/availability",
//   checkAuth(UserRole.Driver),
//   DriverController.updateAvailability
// );
router.patch("/availability", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Driver), driver_controller_1.DriverController.updateAvailability);
router.patch("/:id/update-status", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Driver), driver_controller_1.DriverController.updateStatus);
exports.DriverRoute = router;

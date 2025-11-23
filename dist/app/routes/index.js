"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const driver_route_1 = require("../modules/driver/driver.route");
const ride_route_1 = require("../modules/rider/ride.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/ride",
        route: ride_route_1.RideRoutes,
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRoute,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});

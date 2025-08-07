"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../Modules/user/user.routes");
const auth_router_1 = require("../Modules/auth/auth.router");
const driver_router_1 = require("../Modules/driver/driver.router");
const ride_routes_1 = require("../Modules/ride/ride.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/driver",
        route: driver_router_1.DriverRoutes,
    },
    {
        path: "/ride",
        route: ride_routes_1.RideRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;

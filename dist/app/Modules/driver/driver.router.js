"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = require("express");
const driver_controller_1 = require("./driver.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interfaces_1 = require("../user/user.interfaces");
const validateRequest_1 = require("../../middleware/validateRequest");
const driver_validation_1 = require("./driver.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.RIDER, user_interfaces_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.driverExtensionSchema), driver_controller_1.DriverControllers.createDriver);
router.get("/all-driver-request", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.allDriverRequest);
router.patch("/request-handle/:id", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.driverApproveHandle);
router.get("/", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.allDrivers);
// My order/ request
// earning
exports.DriverRoutes = router;

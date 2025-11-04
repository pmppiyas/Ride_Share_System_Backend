import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../user/user.interfaces";
import { DriverControllers } from "./driver.controller";
import { driverExtensionSchema } from "./driver.validation";

const router = Router();

router.post(
  "/register",
  checkAuth(Role.RIDER, Role.DRIVER),
  validateRequest(driverExtensionSchema),
  DriverControllers.createDriver
);

router.get(
  "/all-driver-request",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverControllers.allDriverRequest
);

router.patch(
  "/request-handle/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverControllers.driverApproveHandle
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.RIDER, Role.DRIVER),
  DriverControllers.getAllDrivers
);

router.get("/earnings", checkAuth(Role.DRIVER), DriverControllers.getMyEarn);

router.get(
  "/ride-history",
  checkAuth(Role.DRIVER),
  DriverControllers.getMyRideReq
);

export const DriverRoutes = router;

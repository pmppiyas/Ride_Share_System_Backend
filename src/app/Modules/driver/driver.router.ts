import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interfaces";

const router = Router();

router.post(
  "/register",
  checkAuth(Role.RIDER, Role.DRIVER),
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

router.get("/approved", DriverControllers.allDrivers);

export const DriverRoutes = router;

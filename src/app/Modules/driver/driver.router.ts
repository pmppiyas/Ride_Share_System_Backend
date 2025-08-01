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

router.get("/all-driver-request", DriverControllers.allDriverRequest);

export const DriverRoutes = router;

import { Router } from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interfaces";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  RideControllers.createRide
);

router.patch(
  "/set-status/:id",
  checkAuth(Role.DRIVER, Role.RIDER),
  RideControllers.setRideStatus
);



export const RideRoutes = router;

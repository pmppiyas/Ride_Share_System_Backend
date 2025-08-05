import { Router } from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interfaces";
import { validateRequest } from "../../middleware/validateRequest";
import { rideRequestSchema } from "./ride.valiadtion";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  validateRequest(rideRequestSchema),
  RideControllers.createRide
);

router.patch(
  "/set-status/:id",
  checkAuth(Role.DRIVER, Role.RIDER),
  RideControllers.setRideStatus
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  RideControllers.getAllRides
);

router.get(
  "/single/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  RideControllers.getSingleRides
);

router.get(
  "/my-rides",
  checkAuth(...Object.values(Role)),
  RideControllers.getmyRides
);
export const RideRoutes = router;

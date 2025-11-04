import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../user/user.interfaces";
import { RideControllers } from "./ride.controller";
import { rideRequestSchema } from "./ride.valiadtion";

const router = Router();

router.post(
  "/find_driver",
  checkAuth(...Object.values(Role)),
  RideControllers.findDriver
);

router.post(
  "/request/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(rideRequestSchema),
  RideControllers.createRide
);

router.patch(
  "/set-status/:id/:status",
  checkAuth(Role.DRIVER, Role.RIDER),
  RideControllers.setRideStatus
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.RIDER),
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

router.get("/my-drives", checkAuth(Role.DRIVER), RideControllers.getmyDrives);

export const RideRoutes = router;

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

export const RideRoutes = router;

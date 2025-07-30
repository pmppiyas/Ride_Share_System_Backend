import { Router } from "express";
import { RiderController } from "./rider.controller";
import { riderZodSchema } from "./rider.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(riderZodSchema),
  RiderController.createRider
);

router.get("/", RiderController.getAllRiders);

export const RiderRoutes = router;

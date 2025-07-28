import { Router } from "express";
import { RiderController } from "./rider.controller";

const router = Router();

router.post("/register", RiderController.createRider);

export const RiderRoutes = router;

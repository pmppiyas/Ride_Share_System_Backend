import { z } from "zod";
import { IRideStatus } from "./ride.interfaces";

export const rideStatusSchema = z.enum([
  IRideStatus.REQUESTED,
  IRideStatus.ACCEPTED,
  IRideStatus.PICKED_UP,
  IRideStatus.IN_TRANSIT,
  IRideStatus.COMPLETED,
  IRideStatus.CANCELED,
]);

import { z } from "zod";
import { IRideStatus } from "./ride.interfaces";

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
});

export const rideRequestSchema = z.object({
  pickupLocation: locationSchema,
  destinationLocation: locationSchema,
});

export const rideStatusSchema = z.enum([
  IRideStatus.REQUESTED,
  IRideStatus.ACCEPTED,
  IRideStatus.PICKED_UP,
  IRideStatus.IN_TRANSIT,
  IRideStatus.COMPLETED,
  IRideStatus.CANCELED,
]);

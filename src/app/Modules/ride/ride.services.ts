import { JwtPayload } from "jsonwebtoken";
import { findNearbyDriver } from "../../utils/findNearDriver";
import { Ride } from "./ride.model";
import { IRideStatus } from "./ride.interfaces";

export const createRide = async (
  decodedToken: JwtPayload,
  payload: {
    pickupLocation: { lat: number; lng: number; address?: string };
    destinationLocation: { lat: number; lng: number; address?: string };
  }
) => {
  const driver = await findNearbyDriver(
    payload.pickupLocation.lat,
    payload.pickupLocation.lng
  );

  if (!driver) throw new Error("No available driver nearby");

  const ride = new Ride({
    rider: decodedToken._id,
    driver: driver._id,
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    status: IRideStatus.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  });

  await ride.save();

  return ride;
};

export const RideServices = {
  createRide,
};

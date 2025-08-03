import { JwtPayload } from "jsonwebtoken";
import { findNearbyDriver } from "../../utils/findNearDriver";
import { Ride } from "./ride.model";
import { IRideStatus } from "./ride.interfaces";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
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

  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "No available driver nearby");

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

const setRideStatus = async (rideId: string, status: IRideStatus) => {
  const ride = await Ride.findById(rideId);

  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

  if (!Object.values(IRideStatus).includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride status");
  }

  const irreversibleStatuses = [
    IRideStatus.PICKED_UP,
    IRideStatus.IN_TRANSIT,
    IRideStatus.COMPLETED,
    IRideStatus.CANCELED,
  ];

  if (
    status === IRideStatus.CANCELED &&
    irreversibleStatuses.includes(ride.status)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot cancel a ride that is already ${ride.status}`
    );
  }

  ride.status = status;

  if (!ride.timestamps) {
    throw new AppError(httpStatus.NOT_FOUND, "Unable to find timestamps");
  }

  switch (status) {
    case IRideStatus.ACCEPTED:
      ride.timestamps.acceptedAt = new Date();
      break;
    case IRideStatus.PICKED_UP:
      ride.timestamps.pickedUpAt = new Date();
      break;
    case IRideStatus.IN_TRANSIT:
      break;
    case IRideStatus.COMPLETED:
      ride.timestamps.completedAt = new Date();
      await User.findByIdAndUpdate(ride.driver, {
        $addToSet: { driveRides: ride._id },
        $inc: { earnings: ride.fare ?? 0 },
      });
      break;
    case IRideStatus.CANCELED:
      ride.timestamps.canceledAt = new Date();
      break;
  }

  await ride.save();
  return ride;
};

export const RideServices = {
  createRide,
  setRideStatus,
};

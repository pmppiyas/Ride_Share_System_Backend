import { JwtPayload } from "jsonwebtoken";
import { findNearbyDriver } from "../../utils/findNearDriver";
import { Ride } from "./ride.model";
import { IRide, IRideStatus } from "./ride.interfaces";
import { HydratedDocument } from "mongoose";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { IDriverStatus } from "../driver/driver.interfaces";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Role } from "../user/user.interfaces";

const createRide = async (
  decodedToken: JwtPayload,
  payload: {
    pickupLocation: { lat: number; lng: number; address?: string };
    destinationLocation: { lat: number; lng: number; address?: string };
  }
) => {
  if (!decodedToken) {
    throw new AppError(httpStatus.NOT_FOUND, "No decodedToken ");
  }
  const rider = await User.findById(decodedToken.userId);
  if (!rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const requestedRide = await Ride.findOne({
    rider: rider._id,
    status: IRideStatus.REQUESTED,
  });

  if (requestedRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an requested ride, Please cancel it first.",
      `Ride ID: ${requestedRide._id}`
    );
  }

  const activeRide = await Ride.findOne({
    rider: rider._id,
    status: {
      $nin: [IRideStatus.COMPLETED, IRideStatus.CANCELED],
    },
  });

  if (activeRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an ongoing ride"
    );
  }

  const driver = await findNearbyDriver(
    payload.pickupLocation.lat,
    payload.pickupLocation.lng
  );

  if (!driver)
    throw new AppError(httpStatus.NOT_FOUND, "No available driver nearby");

  const ride = new Ride({
    rider: decodedToken.userId,
    driver: driver._id,
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    status: IRideStatus.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  });

  await ride.save();

  driver.isAvailable = false;

  await User.findByIdAndUpdate(decodedToken.userId, {
    $addToSet: { rideHistory: ride._id },
  });
  await User.findByIdAndUpdate(ride.driver, {
    $addToSet: { driveRides: ride._id },
  });

  await driver.save();

  return ride;
};

const setRideStatus = async (
  rideId: string,
  status: IRideStatus,
  decodedToken: JwtPayload
) => {
  const ride = await Ride.findById(rideId)
    .populate("rider", "-_id name phone")
    .populate("driver", "-_id name phone rideStatus");

  if (!ride || !ride.driver || !ride.rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (!Object.values(IRideStatus).includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride status");
  }

  const riderAllowedStatuses = [IRideStatus.COMPLETED, IRideStatus.CANCELED];
  const driverAllowedStatuses = Object.values(IRideStatus);

  const allowedStatuses =
    decodedToken.role === Role.DRIVER
      ? driverAllowedStatuses
      : riderAllowedStatuses;

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `You are not allowed to set status to ${status}. Only Driver can do this.`
    );
  }

  const irreversibleStatuses = [
    IRideStatus.PICKED_UP,
    IRideStatus.IN_TRANSIT,
    IRideStatus.COMPLETED,
    IRideStatus.CANCELED,
  ];

  if (
    status === IRideStatus.CANCELED &&
    irreversibleStatuses.includes(ride.status) &&
    decodedToken.role !== Role.DRIVER
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot cancel a ride that is already ${ride.status}`
    );
  }
  if (ride.status == IRideStatus.COMPLETED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "This ride is already completed."
    );
  }

  ride.status = status;

  if (!ride.timestamps) {
    throw new AppError(httpStatus.NOT_FOUND, "Unable to find timestamps");
  }
  if (!ride.driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver ID Not Found.");
  }

  switch (status) {
    case IRideStatus.ACCEPTED:
      ride.timestamps.acceptedAt = new Date();
      await User.findByIdAndUpdate(ride.driver._id, {
        isAvailable: false,
        rideStatus: IDriverStatus.ACCEPTED,
      });

      break;

    case IRideStatus.PICKED_UP:
      ride.timestamps.pickedUpAt = new Date();
      await User.findByIdAndUpdate(ride.driver._id, {
        isAvailable: false,
        rideStatus: IDriverStatus.PICKEDUP,
      });
      break;

    case IRideStatus.IN_TRANSIT:
      await User.findByIdAndUpdate(ride.driver._id, {
        isAvailable: false,
        rideStatus: IDriverStatus.INTRANSIT,
      });
      break;

    case IRideStatus.COMPLETED:
      ride.timestamps.completedAt = new Date();
      await User.findByIdAndUpdate(ride.driver._id, {
        $inc: { earnings: ride.fare ?? 0 },
        isAvailable: true,
        rideStatus: IDriverStatus.COMPLETED,
      });
      break;

    case IRideStatus.CANCELED:
      ride.timestamps.canceledAt = new Date();
      await User.findByIdAndUpdate(ride.driver._id, {
        isAvailable: true,
        rideStatus: IDriverStatus.IDLE,
      });
      break;
  }

  await ride.save();
  return ride;
};

const getAllRides = async (query: Record<string, string> = {}) => {
  const rideSearchableFields = [
    "status",
    "pickupLocation.address",
    "destinationLocation.address",
  ];
  const queryBuilder = new QueryBuilder(Ride.find(), query)
    .filter()
    .search(rideSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    users: data,
    meta,
  };
};

const getSingleRide = async (id: string) => {
  return Ride.findById(id)
    .populate("driver", "-_id name phone")
    .populate("rider", "-_id name phone");
};

const getMyRide = async (decodedToken: JwtPayload) => {
  const myRides = await Ride.find({ rider: decodedToken.userId }).populate(
    "driver",
    "-_id name phone"
  );

  const docCount = await Ride.countDocuments({ rider: decodedToken.userId });

  return {
    data: myRides,
    meta: {
      count: docCount,
    },
  };
};

export const RideServices = {
  createRide,
  setRideStatus,
  getAllRides,
  getSingleRide,
  getMyRide,
};

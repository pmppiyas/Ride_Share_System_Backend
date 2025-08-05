import { JwtPayload } from "jsonwebtoken";
import { findNearbyDriver } from "../../utils/findNearDriver";
import { Ride } from "./ride.model";
import { IRideStatus } from "./ride.interfaces";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { IDriverStatus } from "../driver/driver.interfaces";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createRide = async (
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
  if (!decodedToken) {
    throw new AppError(httpStatus.NOT_FOUND, "No decodedToken ");
  }

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
    irreversibleStatuses.includes(ride.status) &&
    decodedToken.role !== "driver"
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
      await User.findByIdAndUpdate(ride.driver, {
        isAvailable: false,
        rideStatus: IDriverStatus.ACCEPTED,
      });
      break;

    case IRideStatus.PICKED_UP:
      ride.timestamps.pickedUpAt = new Date();
      await User.findByIdAndUpdate(ride.driver, {
        isAvailable: false,
        rideStatus: IDriverStatus.PICKEDUP,
      });
      break;

    case IRideStatus.IN_TRANSIT:
      await User.findByIdAndUpdate(ride.driver, {
        isAvailable: false,
        rideStatus: IDriverStatus.INTRANSIT,
      });
      break;

    case IRideStatus.COMPLETED:
      ride.timestamps.completedAt = new Date();
      await User.findByIdAndUpdate(ride.driver, {
        $inc: { earnings: ride.fare ?? 0 },
        isAvailable: true,
        rideStatus: IDriverStatus.COMPLETED,
      });
      break;

    case IRideStatus.CANCELED:
      ride.timestamps.canceledAt = new Date();
      await User.findByIdAndUpdate(ride.driver, {
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

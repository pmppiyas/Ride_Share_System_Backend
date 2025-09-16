import { JwtPayload } from "jsonwebtoken";
import { findNearbyDriver } from "../../utils/findNearDriver";
import { Ride } from "./ride.model";
import { IRideStatus } from "./ride.interfaces";

import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { IDriverStatus } from "../driver/driver.interfaces";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Role } from "../user/user.interfaces";

const findDriver = async (payload: {
  pickupLocation: { lat: number; lng: number; address?: string };
  destinationLocation: { lat: number; lng: number; address?: string };
}) => {
  console.log(payload);
  const driver = await findNearbyDriver(
    payload.pickupLocation.lat,
    payload.pickupLocation.lng
  );

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "No available driver nearby");
  }

  const meta = driver.length;

  return {
    driver,
    meta,
  };
};

const createRide = async (
  decodedToken: JwtPayload,

  payload: {
    pickupLocation: { lat: number; lng: number; address?: string };
    destinationLocation: { lat: number; lng: number; address?: string };
  },
  driverId: string
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

  console.log(driverId);
  const cleanId = driverId.trim();

  const driver = await User.findById({ _id: cleanId });

  // if (!driver) throw new AppError(httpStatus.NOT_FOUND + 1, "Driver Missing");

  const ride = new Ride({
    rider: decodedToken.userId,
    driver: cleanId,
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    status: IRideStatus.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  });

  await ride.save();

  await User.findByIdAndUpdate(decodedToken.userId, {
    $addToSet: { rideHistory: ride._id },
  });
  await User.findByIdAndUpdate(ride.driver, {
    $addToSet: { driveRides: ride._id },
  });

  if (driver) {
    driver.isAvailable = false;
    await driver.save();
  }

  return ride;
};

const setRideStatus = async (
  rideId: string,
  action: IRideStatus,
  decodedToken: JwtPayload
) => {
  const ride = await Ride.findById(rideId)
    .populate("rider", "-_id name phone")
    .populate("driver", "-_id name phone rideStatus");

  if (!ride || !ride.rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
  }

  if (!Object.values(IRideStatus).includes(action)) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Invalid ride status");
  }

  const riderAllowedStatuses = [IRideStatus.COMPLETED, IRideStatus.CANCELED];
  const driverAllowedStatuses = Object.values(IRideStatus);

  const allowedStatuses =
    decodedToken.role === Role.DRIVER
      ? driverAllowedStatuses
      : riderAllowedStatuses;

  if (!allowedStatuses.includes(action)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `You are not allowed to set status to ${action}. Only Driver can do this.`
    );
  }

  const irreversibleStatuses = [
    IRideStatus.PICKED_UP,
    IRideStatus.IN_TRANSIT,
    IRideStatus.COMPLETED,
    IRideStatus.CANCELED,
  ];

  if (
    action === IRideStatus.CANCELED &&
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

  ride.status = action;

  if (!ride.timestamps) {
    throw new AppError(httpStatus.NOT_FOUND, "Unable to find timestamps");
  }
  // if (!ride.driver) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Driver ID Not Found.");
  // }

  // switch (action) {
  //   case IRideStatus.ACCEPTED:
  //     ride.timestamps.acceptedAt = new Date();
  //     await User.findByIdAndUpdate(ride.driver._id, {
  //       isAvailable: false,
  //       rideStatus: IDriverStatus.ACCEPTED,
  //     });

  //     break;

  //   case IRideStatus.PICKED_UP:
  //     ride.timestamps.pickedUpAt = new Date();
  //     await User.findByIdAndUpdate(ride.driver._id, {
  //       isAvailable: false,
  //       rideStatus: IDriverStatus.PICKEDUP,
  //     });
  //     break;

  //   case IRideStatus.IN_TRANSIT:
  //     await User.findByIdAndUpdate(ride.driver._id, {
  //       isAvailable: false,
  //       rideStatus: IDriverStatus.INTRANSIT,
  //     });
  //     break;

  //   case IRideStatus.COMPLETED:
  //     ride.timestamps.completedAt = new Date();
  //     await User.findByIdAndUpdate(ride.driver._id, {
  //       $inc: { earnings: ride.fare ?? 0 },
  //       isAvailable: true,
  //       rideStatus: IDriverStatus.COMPLETED,
  //     });
  //     break;

  //   case IRideStatus.CANCELED:
  //     ride.timestamps.canceledAt = new Date();
  //     await User.findByIdAndUpdate(ride.driver._id, {
  //       isAvailable: true,
  //       rideStatus: IDriverStatus.IDLE,
  //     });
  //     break;
  // }

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
    queryBuilder.build([
      { path: "driver", select: "-_id name phone" },
      { path: "rider", select: "-_id name phone" },
    ]),

    queryBuilder.getMeta(),
  ]);

  return {
    rides: data,
    meta,
  };
};

const getSingleRide = async (id: string) => {
  return Ride.findById(id)
    .populate("driver", "-_id name phone")
    .populate("rider", "-_id name phone");
};

const getMyRide = async (decodedToken: JwtPayload) => {
  const myRides = await Ride.find({
    rider: decodedToken.userId,
  })
    .sort({
      createAt: 1,
    })
    .populate("driver", "name phone -_id")
    .populate("rider", "name phone -_id");

  const docCount = await Ride.countDocuments({ rider: decodedToken.userId });

  return {
    rides: myRides,
    meta: {
      count: docCount,
    },
  };
};

const getMyDrive = async (decodedToken: JwtPayload) => {
  const myRides = await Ride.find({ driver: decodedToken.userId })
    .populate("driver", "name phone -_id")
    .populate("rider", "name phone -_id");

  const docCount = await Ride.countDocuments({ rider: decodedToken.userId });

  return {
    rides: myRides,
    meta: {
      count: docCount,
    },
  };
};

export const RideServices = {
  findDriver,
  createRide,
  setRideStatus,
  getAllRides,
  getSingleRide,
  getMyRide,
  getMyDrive,
};

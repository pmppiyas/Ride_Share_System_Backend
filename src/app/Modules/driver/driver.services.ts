// src/app/modules/driver/driver.services.ts
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { AppError } from "../../Error/appError";
import { Role } from "../user/user.interfaces";
import {
  IDiverApprove,
  IDriverExtension,
  IDriverStatus,
} from "./driver.interfaces";

import { QueryBuilder } from "../../utils/QueryBuilder";
import { Ride } from "../ride/ride.model";
import { User } from "../user/user.model";

const createDriver = async (
  decodedToken: JwtPayload,
  payload: IDriverExtension
) => {
  if (!Types.ObjectId.isValid(decodedToken.userId)) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Invalid user ID");
  }

  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.approvalStatus === IDiverApprove.PENDING) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Your request is already pending. Please wait few workdays"
    );
  }

  if (
    user.role === Role.DRIVER &&
    user.approvalStatus === IDiverApprove.APPROVED
  ) {
    throw new AppError(httpStatus.CONFLICT, "You are already a driver.");
  }

  user.licenseNumber = payload.licenseNumber;
  user.vehicleInfo = payload.vehicleInfo;
  user.earnings = payload.earnings ?? 0;
  user.approvalStatus = IDiverApprove.PENDING;

  await user.save();

  return user;
};

const allDriverRequest = async (query: Record<string, string> = {}) => {
  const DriverSearchableFields = ["name", "phone", "email"];

  const queryBuilder = new QueryBuilder(
    User.find({
      approvalStatus: IDiverApprove.PENDING,
    }),
    query
  )
    .filter()
    .search(DriverSearchableFields)
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

const driverApprovalHandle = async (id: string, status: IDiverApprove) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Invalid user ID");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "User is not found.");
  }

  if (!status || !Object.values(IDiverApprove).includes(status)) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Please provide a valid status (pending / approved/ refuse/ suspend)."
    );
  }

  const result = await User.findByIdAndUpdate(
    id,
    { approvalStatus: status },
    { new: true, runValidators: true }
  );

  user.role = Role.DRIVER;
  user.isAvailable = true;
  user.isOnline = true;
  user.rideStatus = IDriverStatus.IDLE;
  user.approvalStatus = IDiverApprove.APPROVED;

  await user.save();
  return {
    data: result,
    meta: {
      status: status,
    },
  };
};

const allDrivers = async (query: Record<string, string> = {}) => {
  const DriverSearchableFields = ["name", "phone", "email"];

  const queryBuilder = new QueryBuilder(
    User.find({
      role: Role.DRIVER,
      approvalStatus: IDiverApprove.APPROVED,
    }),
    query
  )
    .filter()
    .search(DriverSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    drivers: data,
    meta,
  };
};

const getMyEarn = async (decodedToken: JwtPayload) => {
  const driver = await User.findById(decodedToken.userId);

  if (
    !driver ||
    driver.role !== Role.DRIVER ||
    driver.approvalStatus !== IDiverApprove.APPROVED
  ) {
    throw new Error("Unauthorized or driver not approved");
  }

  const totalEarnings = driver.earnings || 0;

  return {
    data: driver,
    meta: {
      totalEarnings,
    },
  };
};

const getMyRideReq = async (decodedToken: JwtPayload) => {
  const driverId = decodedToken.userId;

  // Fetch all rides for this driver
  const rides = await Ride.find({ driver: driverId }).sort({ createdAt: -1 });

  // Calculate ride counts by status
  const statusCounts = rides.reduce((acc, ride) => {
    acc[ride.status] = (acc[ride.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Total revenue from completed rides
  const totalRevenue = rides
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (r.fare || 0), 0);

  // Weekly revenue grouping (example by day)
  const weeklyRevenue = {};
  rides.forEach((ride) => {
    if (ride.status === "completed" && ride.createdAt) {
      const day = new Date(ride.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      weeklyRevenue[day] = (weeklyRevenue[day] || 0) + (ride.fare || 0);
    }
  });

  return {
    data: rides,
    meta: { total: rides.length },
    summary: {
      totalRevenue,
      statusCounts,
      weeklyRevenue,
    },
  };
};

export const DriverServices = {
  createDriver,
  allDriverRequest,
  driverApprovalHandle,
  allDrivers,
  getMyEarn,
  getMyRideReq,
};

// src/app/modules/driver/driver.services.ts
import { User } from "../user/user.model";
import { Types } from "mongoose";
import httpStatus from "http-status-codes";
import {
  IDiverApprove,
  IDriverExtension,
  IDriverStatus,
} from "./driver.interfaces";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interfaces";
import { AppError } from "../../Error/appError";

import { Ride } from "../ride/ride.model";


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

  if (
    user.role === Role.DRIVER &&
    user.approvalStatus === IDiverApprove.PENDING
  ) {
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

  user.role = Role.DRIVER;
  user.licenseNumber = payload.licenseNumber;
  user.vehicleInfo = payload.vehicleInfo;
  user.isAvailable = true;
  user.isOnline = true;
  user.earnings = payload.earnings ?? 0;
  user.approvalStatus = IDiverApprove.PENDING;
  user.rideStatus = IDriverStatus.IDLE;

  await user.save();

  return user;
};

const allDriverRequest = async () => {
  const result = await User.find({
    role: Role.DRIVER,
    approvalStatus: IDiverApprove.PENDING,
  });

  const countDoc = await result.length;
  return {
    data: result,
    meta: {
      total: countDoc,
    },
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

  const isDriver = user.role == Role.DRIVER;
  if (!isDriver) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "User is not a driver.");
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

  return {
    data: result,
    meta: {
      status: status,
    },
  };
};

const allDrivers = async () => {
  const allDrivers = await User.find({
    role: Role.DRIVER,
    approvalStatus: IDiverApprove.APPROVED,
  });

  return {
    data: allDrivers,
    meta: {
      total: await allDrivers.length,
    },
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

  const rides = await Ride.find({ driver: driverId }).sort({ createdAt: -1 });

  return {
    data: rides,
    meta: rides.length,
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

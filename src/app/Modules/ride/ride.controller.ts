/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { RideServices } from "./ride.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { rideStatusSchema } from "./ride.valiadtion";
import { AppError } from "../../Error/appError";

const createRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ride = await RideServices.createRide(
      req.user as JwtPayload,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride create successfully",
      data: ride,
    });
  }
);

const setRideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = rideStatusSchema.safeParse(req.body.status);

    if (!result.success) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride status");
    }

    const setStatus = await RideServices.setRideStatus(
      req.params.id,
      result.data,
      req.user as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `Ride ${result.data} successfully`,
      data: setStatus,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rides = await RideServices.getAllRides(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `All rides retrieved successfully`,
      data: rides,
    });
  }
);

const getSingleRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rides = await RideServices.getSingleRide(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `Single ride retrieved successfully`,
      data: rides,
    });
  }
);

const getmyRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const myRides = await RideServices.getMyRide(decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your all rides retrieved successfully.",
      data: myRides,
    });
  }
);

export const RideControllers = {
  createRide,
  setRideStatus,
  getAllRides,
  getSingleRides,
  getmyRides,
};

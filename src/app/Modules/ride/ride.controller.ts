import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { RideServices } from "./ride.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

import { JwtPayload } from "jsonwebtoken";
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
    const { status } = req.body;
    const setStatus = await RideServices.setRideStatus(req.params.id, status);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `Ride ${status} successfully`,
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

export const RideControllers = {
  createRide,
  setRideStatus,
  getAllRides,
  getSingleRides,
};

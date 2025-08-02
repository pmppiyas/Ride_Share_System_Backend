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

export const RideControllers = {
  createRide,
};

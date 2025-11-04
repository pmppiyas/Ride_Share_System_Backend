/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IRideStatus } from "./ride.interfaces";
import { RideServices } from "./ride.services";
import { rideStatusSchema } from "./ride.valiadtion";

const findDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const drivers = await RideServices.findDriver(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Driver found successfully",
      data: drivers,
    });
  }
);

const createRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const ride = await RideServices.createRide(
      req.user as JwtPayload,
      req.body,
      driverId
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
    console.log("params => ", req.params);

    const { id, status } = req.params;

    const ride = await RideServices.setRideStatus(
      id,
      status as IRideStatus,
      req.user as JwtPayload
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Ride status updated successfully.",
      data: ride,
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

const getmyDrives = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const myRides = await RideServices.getMyDrive(decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your all drive retrieved successfully.",
      data: myRides,
    });
  }
);

export const RideControllers = {
  findDriver,
  createRide,
  setRideStatus,
  getAllRides,
  getSingleRides,
  getmyRides,
  getmyDrives,
};

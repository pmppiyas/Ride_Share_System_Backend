import { Request, Response, NextFunction } from "express";
import { RiderServices } from "./rider.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "./../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createRider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rider = await RiderServices.createRider(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rider create successfully",
      data: rider,
    });
  }
);

const getAllRiders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riders = await RiderServices.getAllRider(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rider retrieved successfully",
      data: riders,
    });
  }
);

const updateRider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rider = await RiderServices.updateRider(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rider updated successfully",
      data: rider,
    });
  }
);

export const RiderController = {
  createRider,
  getAllRiders,
  updateRider,
};

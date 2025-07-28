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

export const RiderController = {
  createRider,
};

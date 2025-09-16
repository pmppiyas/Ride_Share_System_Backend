/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { DriverServices } from "./driver.services";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;
    const result = await DriverServices.createDriver(
      user as JwtPayload,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Driver create request successfully",
      data: result,
    });
  }
);

const allDriverRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DriverServices.allDriverRequest(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All requested driver retrieved successfully",
      data: result,
    });
  }
);

const driverApproveHandle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const result = await DriverServices.driverApprovalHandle(
      req.params.id,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `Driver ${result.meta.status} successfully`,
      data: result,
    });
  }
);

const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DriverServices.allDrivers(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All driver retrieved successfully",
      data: result,
    });
  }
);

const getMyEarn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DriverServices.getMyEarn(req.user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "My earnings retrieved successfully",
      data: result,
    });
  }
);

const getMyRideReq = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DriverServices.getMyRideReq(req.user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "My drive request retrieved successfully",
      data: result,
    });
  }
);

export const DriverControllers = {
  createDriver,
  allDriverRequest,
  driverApproveHandle,
  getAllDrivers,
  getMyEarn,
  getMyRideReq,
};

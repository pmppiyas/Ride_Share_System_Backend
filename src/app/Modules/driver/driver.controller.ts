import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { RiderServices } from "./driver.services";
import catchAsync from "../../utils/catchAsync";

const createDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await RiderServices.createDriver(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Driver create successfully",
      data: result,
    });
  }
);

const allDriverRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RiderServices.allDriverRequest();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Driver create successfully",
      data: result,
    });
  }
);

const driverApproveHandle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const result = await RiderServices.driverApprovalHandle(
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

const allDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RiderServices.allDrivers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All driver retrieved successfully",
      data: result,
    });
  }
);

export const DriverControllers = {
  createDriver,
  allDriverRequest,
  driverApproveHandle,
  allDrivers,
};

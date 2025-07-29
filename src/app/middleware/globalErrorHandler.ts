/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { envVars } from "../../config/env";
import httpStatus from "http-status-codes";
import { AppError } from "../Error/appError";
import {
  handleDuplicateError,
  handleZodValidatonError,
  validationError,
} from "../helper/ErrorHelperFunction";
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = httpStatus.BAD_REQUEST;
  let message = `Somethig went wrong ${err.message}`;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  //Duplicate Error
  if (err?.code === 11000 || err?.errorResponse?.code === 11000) {
    const dupFunc = handleDuplicateError(err);
    statusCode = dupFunc.statusCode;
    message = dupFunc.message;
  }

  // Zod Error
  if (err.name === "ZodError") {
    message = handleZodValidatonError(err).message;
    statusCode = httpStatus.NOT_ACCEPTABLE;
  }

  // Validation Error
  else if (err.name === "ValidationError") {
    validationError(err);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : "",
  });
};

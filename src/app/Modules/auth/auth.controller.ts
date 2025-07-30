import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { envVars } from "../../../config/env";

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo =
      req.query?.state && typeof req.query.state === "string"
        ? req.query.state.replace(/^\//, "")
        : "dashboard";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AUthControllers = {
  googleCallback,
};

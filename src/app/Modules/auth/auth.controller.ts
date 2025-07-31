import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { envVars } from "../../../config/env";
import passport from "passport";
import sendResponse from "../../utils/sendResponse";

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

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(httpStatus.METHOD_FAILURE, err));
      }

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, info.message));
      }

      const { password: _password, ...rest } = user.toObject();

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login Successfully",
        data: {
          user: rest,
        },
      });
    })(req, res, next);
  }
);

export const AuthControllers = {
  googleCallback,
  credentialsLogin,
};

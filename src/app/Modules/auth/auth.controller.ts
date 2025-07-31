/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { envVars } from "../../../config/env";
import passport from "passport";
import sendResponse from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";

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
    const tokenInfo = await createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Google login successfully",
      data: null,
    });
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

      const userToken = createUserToken(user);

      setAuthCookie(res, userToken);

      const { password: _password, ...rest } = user.toObject();

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
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

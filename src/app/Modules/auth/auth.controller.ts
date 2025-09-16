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
import { clearAuthCookies } from "../../utils/clearCookie";
import { AuthServices } from "./auth.services";
import { JwtPayload } from "jsonwebtoken";

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

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user?.userId;
    const data = await AuthServices.getMe(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Self get Successfully",
      data: data,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logout successfully",
      data: null,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh-token"];
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Token Genarete Successfully",
      data: tokenInfo,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = await createUserToken(user);
    console.log(tokenInfo);
    setAuthCookie(res, tokenInfo);

    let redirectTo =
      req.query?.state && typeof req.query.state === "string"
        ? req.query.state.replace(/^\//, "")
        : "dashboard";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    if (req.query.json === "true") {
      return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Google login successfully",
        data: tokenInfo,
      });
    }

    res.redirect(`${envVars.FRONTEND_URL1}/${redirectTo}`);
  }
);

export const AuthControllers = {
  googleCallback,
  getMe,
  credentialsLogin,
  logout,
  getNewAccessToken,
  resetPassword,
};

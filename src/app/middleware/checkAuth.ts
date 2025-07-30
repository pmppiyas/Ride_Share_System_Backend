import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../Error/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../../config/env";

import httpsStatus from "http-status-codes";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        envVars.NODE_ENV === "development"
          ? req.headers.authorization
          : req.cookies["access-token"];

      if (!accessToken) {
        throw new AppError(403, "No Token Recived");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_TOKEN
      ) as JwtPayload;
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted for this route");
      }

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.isActive === IsActive.BLOCK ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpsStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpsStatus.BAD_REQUEST, "User is deleted");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };

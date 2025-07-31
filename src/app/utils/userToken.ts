import { envVars } from "../../config/env";
import { AppError } from "../Error/appError";
import { IRider, IsActive } from "../Modules/rider/rider.interfaces";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Rider } from "../Modules/rider/rider.model";

export const createUserToken = (user: Partial<IRider>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN,
    envVars.JWT_ACCESS_EXPIRED
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRED
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refreh token recived from cookies."
    );
  }
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await Rider.findOne({ email: verifyRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isUserExist.isActive === IsActive.BLOCK ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const accessToken = createUserToken(isUserExist);
  return accessToken;
};

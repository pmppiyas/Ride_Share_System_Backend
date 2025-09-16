import { AppError } from "../../Error/appError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { hashingPassword } from "../../utils/hashingPassword";

const getMe = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return newAccessToken;
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
): Promise<boolean> => {
  if (!oldPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Give Old Password as (oldPassword)"
    );
  }

  if (!newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Give New Password as (newPassword)"
    );
  }

  const user = await User.findById(decodedToken.userId);

  if (!user || !user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found or password missing"
    );
  }

  if (oldPassword === newPassword) {
    throw new AppError(
      httpStatus.METHOD_FAILURE,
      "Please give defferent new password"
    );
  }
  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect old password");
  }

  user.password = await hashingPassword(newPassword);

  await user.save();

  return true;
};

export const AuthServices = {
  getMe,
  getNewAccessToken,
  resetPassword,
};

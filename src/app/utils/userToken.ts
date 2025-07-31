import { envVars } from "../../config/env";
import { IRider } from "../Modules/rider/rider.interfaces";
import { generateToken } from "./jwt";

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

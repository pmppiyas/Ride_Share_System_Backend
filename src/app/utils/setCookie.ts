import { Response } from "express";
interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  const isProd = process.env.NODE_ENV === "production";

  if (tokenInfo.accessToken) {
    res.cookie("access-token", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refresh-token", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
};

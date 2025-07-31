import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("access-token", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refresh-token", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};

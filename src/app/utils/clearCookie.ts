import { Response } from "express";

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access-token", { secure: false, sameSite: "lax" });
  res.clearCookie("refresh-token", { secure: false, sameSite: "lax" });
};

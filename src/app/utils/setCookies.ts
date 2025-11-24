import { Response } from "express";

export interface AuthTokens {
  accessToken: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "ride-booking-management-system.vercel.app",
      path: "/",
    });
  }
};

import { CookieOptions } from "express";
import { Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./dateUtils";

export const REFRESH_PATH = "/auth/refresh";

export interface ICookiesParams {
  res: Response;
  accessToken: string;
  refreshToken?: string;
}

const defaultCookieOptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: true,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: fifteenMinutesFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: ICookiesParams) => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
  }
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: REFRESH_PATH });
};

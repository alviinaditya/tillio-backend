import { UNAUTHORIZED } from "../../shared/constants/httpStatusCode";
import { IAccessTokenPayload, verifyToken } from "../../shared/utils/jwtUtils";
import { TokenType } from "../../shared/constants/enums";
import { RequestHandler } from "express";
import { createResponse } from "../../shared/errors/createResponse";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string;
  if (!accessToken) {
    createResponse(res, {
      success: false,
      statusCode: UNAUTHORIZED,
      message: "Access token is missing",
      data: null,
    });
    return;
  }

  const { payload } = verifyToken<IAccessTokenPayload>(
    accessToken,
    TokenType.ACCESS
  );

  if (!payload) {
    createResponse(res, {
      success: false,
      statusCode: UNAUTHORIZED,
      message: "Invalid or expired access token",
      data: null,
    });
    return;
  }

  res.locals.userId = payload?.userId;
  res.locals.role = payload?.role;
  res.locals.sessionId = payload?.sessionId;

  next();
};

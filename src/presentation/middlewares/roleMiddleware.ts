import { RequestHandler } from "express";
import { UserRole } from "../../shared/constants/enums";
import { createResponse } from "../../shared/errors/createResponse";
import { FORBIDDEN } from "../../shared/constants/httpStatusCode";

export const hasRole = (roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (roles.includes(res.locals.role)) {
      next();
    } else {
      createResponse(res, {
        success: false,
        statusCode: FORBIDDEN,
        message: "Forbidden",
        data: null,
      });
    }
  };
};

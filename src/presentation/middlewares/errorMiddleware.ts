import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import {
  clearAuthCookies,
  REFRESH_PATH,
} from "../../shared/utils/cookiesUtils";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../../shared/constants/httpStatusCode";
import ResponseError from "../../shared/errors/ResponseError";
import { createResponse } from "../../shared/errors/createResponse";
import { logger } from "../../shared/providers/LoggerProvider";

const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.join("."),
    }));

    createResponse(res, {
      statusCode: BAD_REQUEST,
      success: false,
      message: "Validation Error",
      data: null,
      error: formattedErrors,
    });
  } else if (error instanceof ResponseError) {
    createResponse(res, {
      statusCode: error.status,
      success: false,
      message: error.message,
      data: null,
    });
  } else {
    logger.error(error);
    createResponse(res, {
      statusCode: INTERNAL_SERVER_ERROR,
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

export default errorMiddleware;

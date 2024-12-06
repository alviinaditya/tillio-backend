import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../dtos/authDTO";

type AsyncRequestHandler<T = any> = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<T>;

const catchError =
  (controller: AsyncRequestHandler): AsyncRequestHandler =>
  async (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchError;

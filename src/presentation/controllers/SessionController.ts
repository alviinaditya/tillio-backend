import { Request, Response } from "express";
import { DIContainer } from "../../di/container";
import { GetAllSessions } from "../../domain/usecases/session/GetAllSessions";
import { GetUserSessions } from "../../domain/usecases/session/GetUserSessions";
import catchError from "../../shared/errors/catchError";
import { createResponse } from "../../shared/errors/createResponse";
import { OK } from "../../shared/constants/httpStatusCode";
import { DeleteSession } from "../../domain/usecases/session/DeleteSession";
import { Types } from "mongoose";
import { GetSessionResponseDTO } from "../../shared/dtos/sessionDTO";

class SessionController {
  private getAllSessions: GetAllSessions;
  private getUserSessions: GetUserSessions;
  private deleteSession: DeleteSession;
  constructor() {
    const diContainer = new DIContainer();
    this.getAllSessions = diContainer.getAllSessionsUseCase();
    this.getUserSessions = diContainer.getUserSessionsUseCase();
    this.deleteSession = diContainer.deleteSessionUseCase();
  }

  static getAll = catchError(async (req: Request, res: Response) => {
    const sessionController = new SessionController();
    const sessions = await sessionController.getAllSessions.execute();
    return createResponse(res, {
      statusCode: OK,
      message: "Sessions fetched successfully",
      success: true,
      data: sessions,
    });
  });

  static getByUser = catchError(async (req: Request, res: Response) => {
    const sessionController = new SessionController();
    const userId = res.locals.userId;
    const sessionId = res.locals.sessionId;
    const sessions = await sessionController.getUserSessions.execute(userId);
    const data: GetSessionResponseDTO = {
      sessions: sessions,
      currentSessionId: sessionId,
    };
    return createResponse(res, {
      statusCode: OK,
      message: "User sessions fetched successfully",
      success: true,
      data,
    });
  });

  static delete = catchError(async (req: Request, res: Response) => {
    const sessionController = new SessionController();
    const sessionId = req.params.sessionId;
    await sessionController.deleteSession.execute(sessionId);
    return createResponse(res, {
      statusCode: OK,
      message: "Session deleted successfully",
      success: true,
      data: null,
    });
  });
}

export default SessionController;

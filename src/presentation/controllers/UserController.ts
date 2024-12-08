import { Request, Response } from "express";
import { DIContainer } from "../../di/container";
import { GetAllUsers } from "../../domain/usecases/user/GetAllUsers";
import catchError from "../../shared/errors/catchError";
import { createResponse } from "../../shared/errors/createResponse";
import { OK } from "../../shared/constants/httpStatusCode";
import { GetUser } from "../../domain/usecases/user/GetUses";
import { ChangePassword } from "../../domain/usecases/user/ChangePassword";
import { ChangePasswordDTO } from "../../shared/dtos/userDTO";
import Validator from "../../shared/utils/Validator";
import UserValidation from "../validations/user/UserValidation";

class UserController {
  private getAllUsers: GetAllUsers;
  private getUser: GetUser;
  private changePassword: ChangePassword;

  constructor() {
    const diContainer = new DIContainer();
    this.getAllUsers = diContainer.getAllUsersUseCase();
    this.getUser = diContainer.getUserUseCase();
    this.changePassword = diContainer.getChangePasswordUseCase();
  }

  static getAll = catchError(async (req: Request, res: Response) => {
    const userController = new UserController();
    const users = await userController.getAllUsers.execute();
    return createResponse(res, {
      statusCode: OK,
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  });

  static getCurrent = catchError(async (req: Request, res: Response) => {
    const userController = new UserController();
    const userId = res.locals.userId;
    const user = await userController.getUser.execute(userId);
    return createResponse(res, {
      statusCode: OK,
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  });

  static changePassword = catchError(async (req: Request, res: Response) => {
    const userController = new UserController();
    const request: ChangePasswordDTO = Validator.validate(
      UserValidation.CHANGE_PASSWORD,
      { ...req.body }
    );
    request.userId = res.locals.userId;
    request.currentSessionId = res.locals.sessionId;
    await userController.changePassword.execute(request);
    return createResponse(res, {
      statusCode: OK,
      message: "Password changed successfully",
      success: true,
      data: null,
    });
  });
}

export default UserController;

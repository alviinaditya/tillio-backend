import { Request, Response } from "express";
import { DIContainer } from "../../di/container";
import { GetAllUsers } from "../../domain/usecases/user/GetAllUsers";
import catchError from "../../shared/errors/catchError";
import { createResponse } from "../../shared/errors/createResponse";
import { OK } from "../../shared/constants/httpStatusCode";
import { GetUser } from "../../domain/usecases/user/GetUses";

class UserController {
  private getAllUsers: GetAllUsers;
  private getUser: GetUser;

  constructor() {
    const diContainer = new DIContainer();
    this.getAllUsers = diContainer.getAllUsersUseCase();
    this.getUser = diContainer.getUserUseCase();
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
}

export default UserController;

import { Request, Response } from "express";
import { DIContainer } from "../../di/container";
import { GetAllUsers } from "../../domain/usecases/user/GetAllUsers";
import catchError from "../../shared/errors/catchError";
import { createResponse } from "../../shared/errors/createResponse";
import { OK } from "../../shared/constants/httpStatusCode";
import { GetUser } from "../../domain/usecases/user/GetUser";
import { ChangePassword } from "../../domain/usecases/user/ChangePassword";
import { ChangePasswordDTO, UpdateProfileDTO } from "../../shared/dtos/userDTO";
import Validator from "../../shared/utils/Validator";
import UserValidation from "../validations/user/UserValidation";
import { UpdateProfile } from "../../domain/usecases/user/UpdateProfile";
import { User } from "../../domain/entities/User";

class UserController {
  private getAllUsers: GetAllUsers;
  private getUser: GetUser;
  private changePassword: ChangePassword;
  private updateProfile: UpdateProfile;

  constructor() {
    const diContainer = new DIContainer();
    this.getAllUsers = diContainer.getAllUsersUseCase();
    this.getUser = diContainer.getUserUseCase();
    this.changePassword = diContainer.getChangePasswordUseCase();
    this.updateProfile = diContainer.getUpdateProfileUseCase();
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

  static updateProfile = catchError(async (req: Request, res: Response) => {
    const userController = new UserController();
    const requestBody = { ...req.body };
    if (req.file) {
      requestBody.avatar = "/user/avatar/" + req.file.filename;
    }
    const request: UpdateProfileDTO = Validator.validate(
      UserValidation.UPDATE_PROFILE,
      requestBody
    );
    request.userId = res.locals.userId;
    const response: Omit<User, "password"> =
      await userController.updateProfile.execute(request);
    return createResponse(res, {
      statusCode: OK,
      message: "Profile updated successfully",
      success: true,
      data: response,
    });
  });
}

export default UserController;

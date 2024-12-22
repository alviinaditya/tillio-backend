import { Request, Response } from "express";
import Validator from "../../shared/utils/Validator";
import UserValidation from "../validations/user/UserValidation";
import {
  LoginUserDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
} from "../../shared/dtos/authDTO";
import {
  clearAuthCookies,
  setAuthCookies,
} from "../../shared/utils/cookiesUtils";
import {
  CREATED,
  OK,
  UNAUTHORIZED,
} from "../../shared/constants/httpStatusCode";
import { DIContainer } from "../../di/container";
import catchError from "../../shared/errors/catchError";
import { RegisterUser } from "../../domain/usecases/auth/RegisterUser";
import { LoginUser } from "../../domain/usecases/auth/LoginUser";
import { LogoutUser } from "../../domain/usecases/auth/LogoutUser";
import { RefreshToken } from "../../domain/usecases/auth/RefreshToken";
import ResponseError from "../../shared/errors/ResponseError";
import { VerifyEmail } from "../../domain/usecases/auth/VerifyEmail";
import { ForgotPassword } from "../../domain/usecases/auth/ForgotPassword";
import { ResetPassword } from "../../domain/usecases/auth/ResetPassword";
import { ResendVerificationEmail } from "../../domain/usecases/auth/ResendVerificationEmail";
import { createResponse } from "../../shared/errors/createResponse";

import os from "os";
import { getDeviceInfo } from "../../shared/utils/getDeviceInfoUtils";

class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  private logoutUser: LogoutUser;
  private refreshToken: RefreshToken;
  private verifyEmail: VerifyEmail;
  private forgotPassword: ForgotPassword;
  private resetPassword: ResetPassword;
  private resendVerificationEmail: ResendVerificationEmail;
  constructor() {
    const diContainer = new DIContainer();
    this.registerUser = diContainer.getRegisterUserUseCase();
    this.loginUser = diContainer.getLoginUserUseCase();
    this.logoutUser = diContainer.getLogoutUserUseCase();
    this.refreshToken = diContainer.getRefreshTokenUseCase();
    this.verifyEmail = diContainer.getVerifyEmailUseCase();
    this.forgotPassword = diContainer.getForgotPasswordUseCase();
    this.resetPassword = diContainer.getResetPasswordUseCase();
    this.resendVerificationEmail = diContainer.getResendVerificationEmail();
  }

  static register = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const request: RegisterUserDTO = Validator.validate(
      UserValidation.REGISTER,
      { ...req.body }
    );

    const user = await authController.registerUser.execute(request);

    return createResponse(res, {
      statusCode: CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  });

  static login = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const userAgent = getDeviceInfo(req.headers["user-agent"]);
    const request: LoginUserDTO = Validator.validate(UserValidation.LOGIN, {
      ...req.body,
      userAgent: userAgent,
    });
    const user = await authController.loginUser.execute(request);
    console.log(user);
    if (user && user.accessToken && user.refreshToken) {
      setAuthCookies({
        res,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    }

    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  });

  static logout = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();

    const accessToken = req.cookies.accessToken;

    const response = await authController.logoutUser.execute(accessToken);

    clearAuthCookies(res);

    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: response.message,
      data: null,
    });
  });

  static refresh = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const receivedRefreshToken = req.cookies.refreshToken;

    const tokenResponse = await authController.refreshToken.execute(
      receivedRefreshToken
    );

    if (tokenResponse) {
      setAuthCookies({
        res,
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
      });
    }

    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: "Token refreshed successfully",
      data: tokenResponse,
    });
  });

  static verifyEmail = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const receivedVerificationCode = req.body.code;

    const validCode = Validator.validate(
      UserValidation.VERIFICATION_CODE,
      receivedVerificationCode
    );

    const response = await authController.verifyEmail.execute(validCode);
    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: "Email verified successfully",
      data: response,
    });
  });

  static forgotPassword = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const request = Validator.validate(
      UserValidation.FORGOT_PASSWORD,
      req.body
    );

    const response = await authController.forgotPassword.execute(request.email);

    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: response.message,
      data: null,
    });
  });

  static resetPassword = catchError(async (req: Request, res: Response) => {
    const authController = new AuthController();
    const request: ResetPasswordDTO = Validator.validate(
      UserValidation.RESET_PASSWORD,
      req.body
    );

    const response = await authController.resetPassword.execute(
      request.code,
      request.password
    );

    return createResponse(res, {
      statusCode: OK,
      success: true,
      message: "Password reset successfully",
      data: response,
    });
  });

  static resendVerificationEmail = catchError(
    async (req: Request, res: Response) => {
      const authController = new AuthController();
      const request = Validator.validate(
        UserValidation.RESEND_VERIFICATION_EMAIL,
        req.body
      );

      const response = await authController.resendVerificationEmail.execute(
        request.email
      );

      return createResponse(res, {
        statusCode: OK,
        success: true,
        message: response.message,
        data: null,
      });
    }
  );
}

export default AuthController;

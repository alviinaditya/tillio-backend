import { SessionRepositoryImpl } from "../data/repositories/SessionRepositoryImpl";
import { UserRepositoryImpl } from "../data/repositories/UserRepositoryImpl";
import { VerificationCodeRepositoryImpl } from "../data/repositories/VerificationCodeRepositoryImpl";
import { ForgotPassword } from "../domain/usecases/auth/ForgotPassword";
import { LoginUser } from "../domain/usecases/auth/LoginUser";
import { LogoutUser } from "../domain/usecases/auth/LogoutUser";
import { RefreshToken } from "../domain/usecases/auth/RefreshToken";
import { RegisterUser } from "../domain/usecases/auth/RegisterUser";
import { ResendVerificationEmail } from "../domain/usecases/auth/ResendVerificationEmail";
import { ResetPassword } from "../domain/usecases/auth/ResetPassword";
import { VerifyEmail } from "../domain/usecases/auth/VerifyEmail";
import { GetAllUsers } from "../domain/usecases/user/GetAllUsers";
import { GetUser } from "../domain/usecases/user/GetUses";

export class DIContainer {
  private userRepository: UserRepositoryImpl;
  private verificationCodeRepository: VerificationCodeRepositoryImpl;
  private sessionRepository: SessionRepositoryImpl;

  constructor() {
    // Instantiate services with their dependencies
    this.userRepository = new UserRepositoryImpl();
    this.verificationCodeRepository = new VerificationCodeRepositoryImpl();
    this.sessionRepository = new SessionRepositoryImpl();
  }

  // Getter methods for each service
  getUserRepository(): UserRepositoryImpl {
    return this.userRepository;
  }

  getVerificationCodeRepository(): VerificationCodeRepositoryImpl {
    return this.verificationCodeRepository;
  }

  getSessionRepository(): SessionRepositoryImpl {
    return this.sessionRepository;
  }

  // Use case construction using constructor injection
  getRegisterUserUseCase(): RegisterUser {
    return new RegisterUser(
      this.getUserRepository(),
      this.getVerificationCodeRepository(),
      this.getSessionRepository()
    );
  }

  getLoginUserUseCase(): LoginUser {
    return new LoginUser(this.getUserRepository(), this.getSessionRepository());
  }

  getLogoutUserUseCase(): LogoutUser {
    return new LogoutUser(this.getSessionRepository());
  }

  getRefreshTokenUseCase(): RefreshToken {
    return new RefreshToken(
      this.getSessionRepository(),
      this.getUserRepository()
    );
  }

  getVerifyEmailUseCase(): VerifyEmail {
    return new VerifyEmail(
      this.getUserRepository(),
      this.getVerificationCodeRepository()
    );
  }

  getForgotPasswordUseCase(): ForgotPassword {
    return new ForgotPassword(
      this.getUserRepository(),
      this.getVerificationCodeRepository()
    );
  }

  getResetPasswordUseCase(): ResetPassword {
    return new ResetPassword(
      this.getUserRepository(),
      this.getVerificationCodeRepository(),
      this.getSessionRepository()
    );
  }

  getResendVerificationEmail(): ResendVerificationEmail {
    return new ResendVerificationEmail(
      this.getUserRepository(),
      this.getVerificationCodeRepository()
    );
  }

  getAllUsersUseCase(): GetAllUsers {
    return new GetAllUsers(this.getUserRepository());
  }

  getUserUseCase(): GetUser {
    return new GetUser(this.getUserRepository());
  }
}
